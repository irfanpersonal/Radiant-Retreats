import {
    Model, Table, Column, DataType, CreatedAt, UpdatedAt, ForeignKey, BelongsTo, AfterCreate, AfterSave, AfterDestroy
} from 'sequelize-typescript';
import User from './User';
import Listing from './Listing';
import zlib from 'zlib';

export interface IReview {
    id: string,
    title: string,
    rating: number,
    content: string,
    userId: string,
    user: User,
    listingId: string,
    listing: Listing
}

@Table({
    modelName: 'Review',
    tableName: 'reviews',
    freezeTableName: true,
    timestamps: true
})
class Review extends Model<IReview> {
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
        },
        set(value: string) {
            if (value) {
                const compressedTitle = zlib.deflateSync(value).toString('base64');
                this.setDataValue('title', compressedTitle);
            }
        },
        get() {
            const compressedTitle = this.getDataValue('title');
            const uncompressedTitle = zlib.inflateSync(Buffer.from(compressedTitle, 'base64')).toString();
            return uncompressedTitle;
        }
    })
    declare title: string;
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
            min: 1, // The minimum value that you can pass in for the rating is 1
            max: 5 // The maximum value that you can pass in for the rating is 5
        },
    })
    declare rating: number;
    @Column({
        type: DataType.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        set(value: string) {
            if (value) {
                const compressedContent = zlib.deflateSync(value).toString('base64');
                this.setDataValue('content', compressedContent);
            }
        },
        get() {
            const compressedContent = this.getDataValue('content');
            const uncompressedContent = zlib.inflateSync(Buffer.from(compressedContent, 'base64')).toString();
            return uncompressedContent;
        }
    })
    declare content: string;
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
    // Upon creating a review or updating a review run the updateListingsAverageRating
    // logic so we are always up to date!
    @AfterDestroy
    @AfterSave
    static updateListingsAverageRating = async(instance: Review) => {
        let totalRating = 0;
        const reviews = await Review.findAll({
            where: {
                listingId: instance.toJSON().listingId
            }
        });
        reviews.forEach(review => {
            totalRating += review.rating;
        });
        const newAverage = totalRating / reviews.length;
        const listing = (await Listing.findByPk(instance.toJSON().listingId))!;
        listing.averageRating = newAverage;
        await listing.save();
    }
}

export default Review;