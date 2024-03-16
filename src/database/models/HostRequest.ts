import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import validator from 'validator';
import User from './User';

export interface IHostRequest {
    id: string,
    userId: string,
    user: User,
    phoneNumber: string,
    governmentIssuedID: string,
    backgroundCheck: string,
    status: string
}

@Table({ 
    modelName: 'HostRequest',
    tableName: 'hostrequests',
    freezeTableName: true,
    timestamps: true
})
class HostRequest extends Model<IHostRequest> {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @ForeignKey(() => User) // Define the Foreign Key Constraint
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare userId: string;
    @BelongsTo(() => User) 
    declare user: User; // Now when I need to populate I will do include: ['user'], which is what I named it.
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            // When creating a custom validator you must throw the error yourself.
            // Or even if you don't pass the check the creation will go through as
            // usual. Which is no good. If you don't pass the checks you should get
            // an error.
            notEmpty: true,
            checkIfValidPhoneNumber: (value: string) => {
                if (!validator.isMobilePhone(value)) {
                    throw new Error('Invalid Phone Number');
                }
            }
        }
    })
    declare phoneNumber: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })  
    declare governmentIssuedID: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare backgroundCheck: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['accepted', 'rejected', 'pending']]
        },
        defaultValue: 'pending'
    })
    declare status: string;
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
}

export default HostRequest;