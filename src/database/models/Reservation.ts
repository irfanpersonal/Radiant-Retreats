import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo
} from 'sequelize-typescript';
import Listing from './Listing';
import User from './User';

export interface IReservation {
    startDate: Date,
    endDate: Date,
    clientSecret: string,
    listingId: string,
    listing: Listing,
    total: number,
    userId: string,
    user: User
}

@Table({
    modelName: 'Reservation',
    tableName: 'reservations',
    freezeTableName: true,
    timestamps: true,
    paranoid: true
})
class Reservation extends Model<IReservation> {
    @Column({
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare startDate: Date;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare endDate: Date;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare clientSecret: string;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare total: number;
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
    @ForeignKey(() => Listing)
    @Column({
        type: DataType.UUID,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    })
    declare listingId: string;
    @BelongsTo(() => Listing) 
    declare listing: Listing;
    @CreatedAt
    declare createdAt: Date;
    @UpdatedAt
    declare updatedAt: Date;
}

export default Reservation;