import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import User from './User';

export interface ICashOut {
    id: string,
    fullName: string,
    accountNumber: string,
    routingNumber: string, 
    amount: number,
    status: string,
    user: User,
    userId: string,
    createdAt: Date,
    updatedAt: Date
}

@Table({ 
    modelName: 'CashOut',
    tableName: 'cashouts',
    freezeTableName: true,
    timestamps: true
})
class CashOut extends Model<ICashOut> {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare fullName: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare accountNumber: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare routingNumber: string;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare amount: number;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: [['pending', 'paid']]
        },
        defaultValue: 'pending'
    })
    declare status: string;
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare userId: string;
    @BelongsTo(() => User) 
    declare user: User; 
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
}

export default CashOut;