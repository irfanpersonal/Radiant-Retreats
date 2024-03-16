import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, BeforeSave, HasOne, HasMany
} from 'sequelize-typescript';
import bcrypt from 'bcryptjs';
import {isValidCountry, isValidLanguage} from '../../utils';
import HostRequest from './HostRequest';
import Listing from './Listing';
import Reservation from './Reservation';
import CashOut from './CashOut';

// Define the Type for User
export interface IUser {
    id: string,
    firstName: string,
    lastName: string,
    birthdate: Date,
    email: string,
    password: string,
    role: 'guest' | 'host' | 'admin',
    profilePicture?: string,
    balance: number,
    createdAt?: Date,
    updatedAt?: Date
}

// The @SOMETHING is referred to as a decorator. Think of it as a setting we can
// apply to a class, the classes properties, the classes methods, the classes
// accessors, or the classes parameters. 

// For example the @Table decorator allows us to specify settings for this model/table
// we are about to create. And inside of it we have set some values for modelName, 
// tableName, freezeTableName, and timestamps.
@Table({ 
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
    timestamps: true
})
class User extends Model<IUser> {
    // The @Column decorator allows us to specify settings for the column in our
    // model/table. So we can specify things like primaryKey, type, and more.
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    // The declare word used here simply means we are specifying a TYPE not the 
    // implementation.
    declare id: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    })
    declare firstName: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare lastName: string;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare birthdate: Date;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    })
    declare email: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare password: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: 'customer',
        validate: {
            notEmpty: true,
            isIn: [['guest', 'host', 'admin']]
        }
    })
    declare role: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: ''
    })
    declare profilePicture: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            // When creating a custom validator you must throw the error yourself.
            // Or even if you don't pass the check the creation will go through as
            // usual. Which is no good. If you don't pass the checks you should get
            // an error.
            checkIfValidCountry(value: string) {
                if (!isValidCountry(value)) {
                    throw new Error('Invalid Country');
                }
            }
        }
    })
    declare country: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            checkIfValidLanguage(value: string) {
                if (!isValidLanguage(value)) {
                    throw new Error('Invalid Language');
                }
            }
        }
    })
    declare language: string;
    @Column({
        type: DataType.INTEGER,
        defaultValue: 0
    })
    declare balance: number;
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
    // We are defining an assocation. Here we are saying that the User "HasOne" HostRequest.
    // The reason we used "HasOne" here instead of "BelongsTo" is because this is the parent
    // table. This is the table who's primary key is being referenced by the child table.
    // And User can exist on its own whereas HostRequest cannot it must be tied to a user
    @HasOne(() => HostRequest)
    declare hostRequest: HostRequest;
    @HasMany(() => Listing)
    declare listing: Listing;
    @HasMany(() => Reservation)
    declare reservation: Reservation;
    @HasMany(() => CashOut)
    declare cashout: CashOut;
    // The @BeforeCreate is a decorator which allows us to specify a method we would
    // like to run when an instance of a User is made or updated
    @BeforeSave 
    static hashPasswordOnCreationOfUserOrPasswordChange = async(instance: User) => {
        if (instance.changed('password')) {
            const randomBytes = await bcrypt.genSalt(10);
            instance.password = await bcrypt.hash(instance.password, randomBytes);
        }
    }
    // Instance Method 
    async comparePassword(guess: string) {
        const isCorrect = await bcrypt.compare(guess, this.password);
        return isCorrect;
    }
}

export default User;