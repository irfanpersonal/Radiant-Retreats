const {StatusCodes} = require('http-status-codes');
const {createJWT, attachCookieToResponse, checkIfAllowed} = require('../utils');
const {User} = require('../models');
const path = require('node:path');
const fs = require('node:fs');
const CustomError = require('../errors');

const showCurrentUser = async(req, res) => {
    return res.status(StatusCodes.OK).json({user: req.user});
}

const getSingleUser = async(req, res) => {
    const {id} = req.params;
    const user = await User.findOne({where: {id: id}});
    if (!user) {
        throw new CustomError.NotFoundError('No User Found with the Information Provided!');
    }
    checkIfAllowed(req.user, id);
    return res.status(StatusCodes.OK).json({user});
}

const updateSingleUser = async(req, res) => {
    const {name, email, bio} = req.body;
    const user = await User.findOne({where: {id: req.user.userID}});
    if (name) {
        user.name = name;
    }
    if (email) {
        user.email = email;
    }
    if (bio) {
        user.bio = bio;
    }
    if (req?.files?.profilePicture) {
        if (user.profilePicture) {
            await fs.unlink(path.join(__dirname, '../images', user.profilePicture), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        const profilePicture = req.files.profilePicture;
        const uniqueIdentifier = new Date().getTime() + '_' + user.name + '_' + profilePicture.name;
        const destination = path.resolve(__dirname, '../images', uniqueIdentifier);
        await profilePicture.mv(destination);
        user.profilePicture = `/${uniqueIdentifier}`;
    }
    await user.save();
    return res.status(StatusCodes.OK).json({user: {
        userID: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture
    }});
}

const updateSingleUserPassword = async(req, res) => {
    const {oldPassword, newPassword} = req.body;
    if (!oldPassword || !newPassword) {
        throw new CustomError.BadRequestError('Please provide oldPassword and newPassword!');
    }
    const user = await User.findOne({where: {email: req.user.email}});
    const isCorrect = await user.comparePassword(oldPassword);
    if (!isCorrect) {
        throw new CustomError.BadRequestError('Incorrect Old Password!');
    }
    user.password = newPassword;
    await user.save();
    const token = createJWT(user);
    attachCookieToResponse(res, token);
    return res.status(StatusCodes.OK).json({user: {
        userID: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        profilePicture: user.profilePicture
    }});
}

module.exports = {
    showCurrentUser,
    getSingleUser,
    updateSingleUser,
    updateSingleUserPassword
};