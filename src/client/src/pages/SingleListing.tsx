import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ImageViewer, ReservationBox, ReviewList, EditListing, ReservationList, Modal} from '../components';
import {setPage, updateSearchBoxValues} from '../features/reviews/reviewsSlice';
import {deleteSingleListing, getSingleListing, getSingleListingWithAuth} from '../features/listing/listingThunk';
import {useParams, Link, useNavigate} from 'react-router-dom';
import {createReview, getListingReviews, getListingReviewsWithAuth} from '../features/reviews/reviewsThunk';
import {FaInfoCircle} from "react-icons/fa";
import {setPage as setPageForReservation} from '../features/reservation/reservationSlice';
import {getAllListingReservations} from '../features/reservation/reservationThunk';
import {setIsEditing} from '../features/listing/listingSlice';
import { MdDeleteOutline , MdOutlineEdit } from "react-icons/md";

import { LiaUserAltSolid , LiaExpandSolid , LiaBedSolid , LiaBathSolid , LiaMapPinSolid} from "react-icons/lia";


const SingleListing: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const [isAddingReview, setIsAddingReview] = React.useState<boolean>(false);
    const [modal, setModal] = React.useState<boolean>(false);
    const toggleModal = () => {
        setModal(currentState => {
            return !currentState;
        });
    }
    const {listing, getSingleListingLoading, deleteSingleListingLoading, isEditing} = useSelector((store: useSelectorType) => store.listing);
    const {getAllListingReservationsLoading, reservations, totalReservations, numberOfPages: numberOfPagesForReservations, page: pageForReservation} = useSelector((store: useSelectorType) => store.reservation);
    const {getListingReviewsLoading, reviews, totalReviews, numberOfPages, page, searchBoxValues, createReviewLoading} = useSelector((store: useSelectorType) => store.reviews);
    const {user} = useSelector((store: useSelectorType) => store.user);
    const cancelEdit = () => {
        dispatch(setIsEditing(false));
    }
    const handleAddReview = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('title', (target.elements.namedItem('title') as HTMLInputElement).value);
        formData.append('rating', (target.elements.namedItem('rating') as HTMLInputElement).value);
        formData.append('content', (target.elements.namedItem('content') as HTMLInputElement).value);
        dispatch(createReview({listingID: id!, data: formData}));
        setIsAddingReview(currentState => {
            return !currentState;
        });
    }
    React.useEffect(() => {
        if (user) {
            dispatch(getSingleListingWithAuth(id!));
            dispatch(getListingReviewsWithAuth(id!));
            return;
        }
        if (!user) {
            dispatch(getSingleListing(id!));
            dispatch(getListingReviews(id!));
        }
    }, []);
    React.useEffect(() => {
        if (listing?.myListing) {
            dispatch(getAllListingReservations(id!));
        }
    }, [listing?.myListing]);
    return (
        <Wrapper>
            {getSingleListingLoading ? (
                <Loading title="Loading Single Listing" position='normal'/>
            ) : (
                <>
                    {isEditing ? (
                        <EditListing data={listing!} cancelEdit={cancelEdit}/>
                    ) : (
                        <div className="container">
                            <div className="listing-container">
                                {listing!?.didReserveAtOnePoint && (
                                    <div className="did-reserve">
                                        <FaInfoCircle/>
                                        <div className="did-reserve-label">You already reserved this listing at one point.</div>
                                        <Link to={`/reservation/${listing!?.didReserveAtOnePoint.id}`}>View</Link>
                                    </div>
                                )}
                                {listing!.myListing && (
                                    <div className="hostOptions">
                                        <div className="hoEdit" onClick={() => {
                                            dispatch(setIsEditing(true));
                                        }}><MdOutlineEdit/>Edit</div>
                                        <div onClick={() => {
                                            toggleModal();
                                        }} className="hoDelete">
                                            <MdDeleteOutline/>Delete
                                        </div>
                                    </div>
                                )}
                                <ImageViewer data={listing!?.photos} viewType='advanced' fullWidth={true}/>
                                <div className="container">
                                    <div className="left-side">
                                        <h1 className="listingTitle">{listing!.name}</h1>
                                        <div className="locationLine"><LiaMapPinSolid/> {listing!.country}</div>

                                        <div className="listingMeta">
                                            <div><LiaUserAltSolid /> {listing!.housingCapacity} Guests</div>
                                            <div><LiaExpandSolid /> {listing!.bedrooms} Bedrooms</div>
                                            <div><LiaBedSolid /> {listing!.beds} Beds</div>
                                            <div><LiaBathSolid/> {listing!.baths} Baths</div>
                                        </div>

                                        <div className="listingDescription">
                                            <div className="listingDescriptionLabel">Description</div>
                                            <div className="listingDescriptionValue">{listing!.description}</div>

                                        </div>

                                        <div className="listingAmenities">
                                            <div className="listingAmenitiesLabel">Amenities</div>
                                            <>
                                                {Array.isArray(listing!.amenities) ? (
                                                    <>
                                                        {listing!.amenities.map(amenity => {
                                                            return (
                                                                <div key={amenity} className="amenitiesItem">
                                                                    <div className="amenitiesDecor"></div>
                                                                    <div className="amenitiesValue">{amenity}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </>
                                                ) : (
                                                    <div className='amenity-box'>{listing!.amenities}</div>
                                                )}
                                            </>
                                        </div>

                                        <div className="listingHost">
                                            <div className="listingHostTitle">Meet the Host</div>
                                            <div className="listingHostDetails">
                                                <img className="listingHostIco" src={listing!.user.profilePicture || emptyProfilePicture} alt={listing!.user.firstName}/>
                                                <div className="listingHostMeta">
                                                    <div className="listingHostMetaMain">
                                                        <div className="listingHostMetaName">{listing!.user.firstName}</div>
                                                        <div className="listingHostMetaDate">Hosting since {moment(listing!.createdAt).format('MMMM Do YYYY')}</div>
                                                    </div>
                                                    <button className="listingHostButton" onClick={() => {navigate(`/user/${listing!.userId}`);}}>View Profile</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="listingReviews">
                                            {getListingReviewsLoading ? (
                                                <Loading title="Loading Listing Reviews" position='normal'/>
                                            ) : (
                                                <>
                                                    <div className="listingReviewsHeader">
                                                        <h1 className="listingReviewsHeaderTitle">{listing!.averageRating ? ' Reviews - ' + Number(listing!.averageRating).toFixed(2) : 'No Reviews'} {'(' + totalReviews + ')'} </h1>
                                                        <div className="listingReviewsHeaderOptions">
                                                            <select id="sort" name="sort" defaultValue={searchBoxValues.sort} onChange={(event) => {
                                                                dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                                                                dispatch(getListingReviews(id!));
                                                            }}>
                                                                <option value=""></option>
                                                                <option value="oldest">Oldest</option>
                                                                <option value="latest">Latest</option>
                                                                <option value="lowest-rating">Lowest Rating</option>
                                                                <option value="highest-rating">Highest Rating</option>
                                                            </select>
                                                            {(!listing!.myListing && listing!?.didReserveAtOnePoint) && (
                                                                <div className="add-btn" onClick={() => {
                                                                    setIsAddingReview(currentState => {
                                                                        return !currentState;
                                                                    });
                                                                }}>{isAddingReview ? <div className="cancelReview">Cancel</div> : <div className="addReview">Add Review</div>}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {isAddingReview && (
                                                        <form className="addReviewForm" onSubmit={handleAddReview}>
                                                            <div className="addReviewRow">
                                                                <div className="addReviewCombo">
                                                                    <label>Title</label>
                                                                    <input placeholder="Enter your title" id="title" name="title" required/>
                                                                </div>

                                                                <div className="addReviewCombo comboInitial">
                                                                    <label>Rating</label>
                                                                    <select id="rating" name="rating" required>
                                                                        <option value="5">5</option>
                                                                        <option value="4">4</option>
                                                                        <option value="3">3</option>
                                                                        <option value="2">2</option>
                                                                        <option value="1">1</option>
                                                                    </select>
                                                                </div>
                                                                
                                                            </div>

                                                            <div className="addReviewRow">
                                                                <div className="addReviewCombo">
                                                                    <label>Review</label>
                                                                    <textarea placeholder="Begin typing review" id="content" name="content"></textarea>
                                                                </div>
                                                            </div>
                                                        
                                                            <div className="createReviewWrapper">
                                                                <button type="submit" disabled={createReviewLoading}>{createReviewLoading ? 'Creating Review' : 'Create Review'}</button>
                                                            </div>
                                                        
                                                        </form>
                                                    )}
                                                    <div className="">
                                                        <ReviewList data={reviews} numberOfPages={numberOfPages as number} page={page as number} totalReviews={totalReviews as number} changePage={setPage} updateSearch={getListingReviews} _id={id!}/>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="right-side">
                                        {(!listing!.myListing) && (
                                            <>
                                                {user!?.role !== 'admin' && (
                                                    <ReservationBox data={listing!}/>
                                                )}
                                            </>
                                        )}
                                        {listing!.myListing && (
                                            <div className="right-side">
                                                {getAllListingReservationsLoading ? (
                                                    <Loading title="Get All Listing Reservations" position='normal'/>
                                                ) : (
                                                    <ReservationList data={reservations} numberOfPages={numberOfPagesForReservations as number} page={pageForReservation as number} totalReservations={totalReservations as number} changePage={setPageForReservation} updateSearch={getAllListingReservations} _id={id!}/>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            {modal && (
                <Modal title="Delete Listing" toggleModal={toggleModal}>
                    <p>Are you certain you want to proceed with deleting this listing? This action is irreversible, so please ensure your decision is final.</p>
                    <button style={{width: '100%', padding: '0.25rem'}} disabled={deleteSingleListingLoading} onClick={() => {
                        dispatch(deleteSingleListing(id!));
                    }}>{deleteSingleListingLoading ? 'Deleting' : 'Delete'}</button>
                </Modal>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .listing-container {
        .container {
            display: flex;
            flex-direction:row;
            .left-side {
                flex:1;
                display:flex;
                flex-direction:column;
            }
            .right-side {
                width:500px;
                max-width:100%;
                display:flex;
                flex-direction:column;
                padding-left:40px;
                .grid-styling {
                    grid-template-columns: repeat(1, 1fr) !important;
                }
                .listingType {
                    pointer-events: none;
                }
            }
        }
        .user-box {
            outline: 1px solid black;
            display: flex;
            align-items: center;
            margin-top: 1rem;
            .user-image {
                width: 5rem;
                height: 5rem;
                outline: 1px solid black;
                margin-right: 1rem;
                cursor: pointer;
            }
        }
        .amenity-container {
            .amenity-box {
                outline: 1px solid black;
                margin: 1rem 0;
                padding: 0.5rem;
            }
        }
        .review-container {
            margin-top: 1rem;
            outline: 1px solid black;
            padding: 1rem;
            .review-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .review-options {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    select {
                        padding: 0.15rem;
                    }
                }
                .add-btn {
                    margin-left: 1rem;
                    cursor: pointer;
                    user-select: none;
                    background-color: lightgray;
                    padding: 0 0.5rem;
                    outline: 1px solid black;
                }
                .add-btn:hover, .add-btn:active {
                    background-color: white;
                }
            }
        }
    }
    .margin-top {
        margin-top: 0.5rem;
    }
    .add-review-form {
        background-color: lightgray;
        padding: 0.5rem;
        margin: 1rem 0;
        .add-review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        input, select, textarea, button {
            padding: 0.25rem;
        }
        input {
            width: 50%;
        }
        select {
            width: 10%;
        }
        textarea {
            margin-top: 1rem;
            width: 100%;
            height: 5rem;
            resize: none;
        }
        button {
            width: 100%;
        }
    }
    .option-box {
        display: flex;  
        .edit-btn, .delete-btn {
            outline: 1px solid black;
            width: 30%;
            cursor: pointer;
            background-color: lightgray;
            padding: 0.25rem;
            text-align: center;
            margin-top: 0.25rem;    
        }
        .delete-btn {
            margin-left: 0.5rem;
        }
        .edit-btn:hover, .edit-btn:active, .delete-btn:hover, .delete-btn:active {
            background-color: white;
        }
    }
    .selected {
        outline: 0.15rem solid red;
    }
    .listing-reservations {
        width: 90%;
        margin-left: auto;
    }

    .listingTitle {
        font-size:24px;
        font-weight:500;
    }
    .locationLine {
        color:#717171;
        font-size:14px;
        display:flex;
        align-items:center;
    }
    .locationLine svg {
        color:#000000;
        margin-right:10px;
    }
    .listingMeta {
        display:flex;
        flex-direction:row;
        align-items:center;
        padding:20px 0px;
    }
    .listingMeta div {
        font-size:14px;
        display:flex;
        flex-direction:row;
        align-items:center;
        margin-right:40px;
    }
    .listingMeta div svg {
        margin-right:10px;
    }
    .listingDescription {
        padding:30px 0px;
        border-top:1px solid #e7e7e7;
        border-bottom:1px solid #e7e7e7;
    }
    .listingDescriptionLabel {
        font-size:18px;
        font-weight:500;
        margin-bottom:20px;
    }
    .listingDescriptionValue {
        font-size:14px;
    }
    .listingAmenities {
        padding:30px 0px;
    }
    .listingAmenitiesLabel {
        font-size:18px;
        font-weight:500;
        margin-bottom:20px;
    }
    .amenitiesItem {
        display:flex;
        flex-direction:row;
        align-items:center;
        padding:6px 0px;
    }
    .amenitiesDecor {
        width:8px;
        height:8px;
        margin-right:20px;
        border:1px solid #000000;
        border-radius:2px;
    }
    .amenitiesValue {
        font-size:14px;
    }
    .did-reserve {
        display:flex;
        padding:20px;
        margin-top:40px;
        border-radius:12px;
        flex-direction:row;
        align-items:center;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
    }
    .did-reserve svg {
        color:#717171;
        margin-right:10px;
    }
    .did-reserve-label {
        flex:1;
        display:flex;
        font-size:14px;
    }
    .did-reserve a {
        color:#FFFFFF;
        font-size:12px;
        padding:12px 30px;
        border-radius:12px;
        background-color:#717171;
    }
    .listingHost {
        display:flex;
        flex-direction:column;
        padding:30px 0px;
        border-top:1px solid #e7e7e7;
    }
    .listingHostTitle {
        font-size:18px;
        font-weight:500;
        margin-bottom:20px;
    }
    .listingHostIco {
        width:200px;
        height:200px;
        border-radius:12px;
    }
    .listingHostDetails {
        flex:1;
        display:flex;
        flex-direction:row;
        align-items:center;
        margin:10px 0px;
    }
    .listingHostMeta {
        flex:1;
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        padding-left:20px;
    }
    .listingHostMetaMain {
        flex:1;
        display:flex;
        flex-direction:column;
    }
    .listingHostMetaName {
        font-size:14px;
    }
    .listingHostMetaDate {
        color:#717171;
        font-size:14px;
        margin-top:6px;
        margin-bottom:15px;
    }
    .listingHostButton {
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        border-width:0px;
        border:1px solid #eeeeee;
        cursor:pointer;
        background-color:transparent;
    }
    .listingReviews {
        padding:30px 0px;
        border-top:1px solid #e7e7e7;
    }
    .listingReviewsHeader {
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .listingReviewsHeaderTitle {
        font-size:18px;
        font-weight:500;
    }
    .listingReviewsHeaderOptions {
        display:flex;
        flex-direction:row-reverse;
        align-items:center;
    }
    .listingReviewsHeaderOptions select {
        padding:10px 10px;
        border-radius:12px;
        border:1px solid #eeeeee;
        background-color:#f7f7f7;
    }
    .addReview {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        background-color: #000000;
        margin-right:10px;
        cursor:pointer;
    }
    .cancelReview {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        background-color: #d13b53;
        margin-right:10px;
        border:1px solid #eeeeee;
        cursor:pointer;
    }
    .addReviewForm {
        padding: 12px;
        display:flex;
        flex-direction:column;
        border-radius: 20px;
        background-color: #F5F5F4;
        margin-top:30px;
        border: 1px solid rgba(17, 17, 17, 0.04);
    }
    .addReviewRow {
        display:flex;
        flex-direction:row;
    }
    .addReviewCombo {
        flex:1;
        padding:12px;
        display:flex;
        flex-direction:column;
    }
    .comboInitial {
        flex:initial;
    }
    .addReviewCombo input , .addReviewCombo select {
        flex: 1;
        display: flex;
        border-width: 0px;
        border-radius: 12px;
        background-color: #FFFFFF;
        padding: 14px 14px 14px 14px;
    }
    .addReviewCombo textarea {
        flex: 1;
        height:100px;
        resize:none;
        display: flex;
        border-width: 0px;
        border-radius: 12px;
        background-color: #FFFFFF;
        padding: 14px 14px 14px 14px;
    }
    .addReviewCombo label {
        color: #717171;
        font-size: 12px;
        margin-bottom: 10px;
    }
    .createReviewWrapper {
        padding:12px;
        display:flex;
        flex-direction:row;
    }
    .createReviewWrapper button {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        border-width:0px;
        background-color: #000000;
        margin-right: 10px;
        cursor: pointer;
    }
    .hostOptions {
        display:flex;
        flex-direction:row;
        align-items: center;
        justify-content: space-between;
        padding-top:40px;
        .hoEdit {
            height: 48px;
            font-size:14px;
            color: #FFFFFF;
            font-weight: 500;
            padding:0px 40px;
            border-radius: 12px;
            background-color: #2d814e;
            border-width: 0px;
            display:flex;
            align-items: center;
            justify-content: space-around;
            cursor:pointer;
        }
        .hoDelete {
            height: 48px;
            font-size:14px;
            color: #FFFFFF;
            font-weight: 500;
            padding:0px 30px;
            border-radius: 12px;
            background-color: #d13b53;
            border-width: 0px;
            display:flex;
            align-items: center;
            justify-content: center;
            cursor:pointer;
        }
        svg {
            margin-right:10px;
        }
    }
    @media (max-width:768px) {
        .right-side {
            margin:0px 0px;
            padding-left:0px !important;
            .pageHeader {
                padding:30px 0px;
            }
            .grid-styling {
                padding:30px 0px;
            }
        }
        .listingMeta {
            align-items:initial;
            flex-direction:column;
            div {
                flex:1;
                padding:20px 0px;
                margin-right:0px;
                border-bottom:1px solid #e7e7e7;
            }
        }
        .listingDescription {border-top-width:0px;}
        .listingReviews {
            padding-bottom:20px;
        }
        .bookingBox {
            margin-bottom:30px;
        }
    }
`;

export default SingleListing;