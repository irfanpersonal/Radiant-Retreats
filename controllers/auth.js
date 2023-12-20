const {StatusCodes} = require('http-status-codes');
const {User} = require('../models');
const {createJWT, attachCookieToResponse} = require('../utils');
const CustomError = require('../errors');
const path = require('node:path');

const register = async(req, res) => {
    const {name, email, password, role, bio} = req.body;
    let theImage = null;
    if (req?.files?.profilePicture) {
        const profilePicture = req.files.profilePicture;
        const uniqueIdentifier = new Date().getTime() + '_' + name + '_' + profilePicture.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await profilePicture.mv(destination);
        theImage = `/${uniqueIdentifier}`;
    }
    const user = await User.create({name, email, password, role, bio, profilePicture: theImage});
    const token = createJWT(user);
    attachCookieToResponse(res, token);
    return res.status(StatusCodes.CREATED).json({user: {
        userID: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture,
        maintenanceFee: user.maintenanceFee
    }});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        throw new CustomError.BadRequestError('Please provide both email and password!');
    }
    const user = await User.findOne({where: {email}});
    if (!user) {
        throw new CustomError.BadRequestError('No User Found with the Email Provided!');
    }
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
        throw new CustomError.UnauthorizedError('Invalid Password!');
    }
    const token = createJWT(user);
    attachCookieToResponse(res, token);
    return res.status(StatusCodes.OK).json({user: {
        userID: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture,
        maintenanceFee: user.maintenanceFee
    }});
}

const logout = async(req, res) => {
    res.clearCookie('token');
    return res.status(StatusCodes.OK).json({msg: 'Successfully Logged Out!'});
}

module.exports = {
    register,
    login,
    logout
};