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
import {FaLocationDot} from "react-icons/fa6";

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
                        <div className="listing-container">
                            {listing!?.didReserveAtOnePoint && (
                                <div className="did-reserve">
                                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}><FaInfoCircle/></div>
                                    <div>You already reserved this listing at one point. <Link to={`/reservation/${listing!?.didReserveAtOnePoint.id}`}>View</Link></div>
                                </div>
                            )}
                            <ImageViewer data={listing!?.photos} viewType='advanced' fullWidth={true}/>
                            <div className="container">
                                <div className="left-side">
                                    <h1>{listing!.name}</h1>
                                    <div>{listing!.housingCapacity} Guests ⚪️ {listing!.bedrooms} bedrooms ⚪️ {listing!.beds} beds ⚪️ {listing!.baths} baths</div>
                                    <div><FaLocationDot/> {listing!.country}</div>
                                    <div>⭐️ {listing!.averageRating ? listing!.averageRating : 'No Ratings'}</div>
                                    <div className="user-box">
                                        <img onClick={() => {
                                            navigate(`/user/${listing!.userId}`);
                                        }} className="user-image" src={listing!.user.profilePicture || emptyProfilePicture} alt={listing!.user.firstName}/>
                                        <div>
                                            <div>Hosted by {listing!.user.firstName}</div>
                                            <div>Hosting since {moment(listing!.createdAt).format('MMMM Do YYYY')}</div>
                                        </div>
                                    </div>
                                    <div className='amenity-container'>
                                        <>
                                            {Array.isArray(listing!.amenities) ? (
                                                <>
                                                    {listing!.amenities.map(amenity => {
                                                        return (
                                                            <div key={amenity} className='amenity-box'>{amenity}</div>
                                                        );
                                                    })}
                                                </>
                                            ) : (
                                                <div className='amenity-box'>{listing!.amenities}</div>
                                            )}
                                        </>
                                    </div>
                                    <div style={{marginBottom: '0.5rem', backgroundColor: 'lightgray', padding: '0.5rem'}}>Description: {listing!.description}</div>
                                    {listing!.myListing && (
                                        <div className="option-box">
                                            <div onClick={() => {
                                                dispatch(setIsEditing(true));
                                            }} className="edit-btn">Edit</div>
                                            <div onClick={() => {
                                                toggleModal();
                                            }} className="delete-btn">
                                                Delete
                                            </div>
                                        </div>
                                    )}
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
                                        <div className="listing-reservations">
                                            {getAllListingReservationsLoading ? (
                                                <Loading title="Get All Listing Reservations" position='normal'/>
                                            ) : (
                                                <ReservationList data={reservations} numberOfPages={numberOfPagesForReservations as number} page={pageForReservation as number} totalReservations={totalReservations as number} changePage={setPageForReservation} updateSearch={getAllListingReservations} _id={id!}/>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="review-container">
                                {getListingReviewsLoading ? (
                                    <Loading title="Loading Listing Reviews" position='normal'/>
                                ) : (
                                    <>
                                        <div className="review-header">
                                            <h1>⭐️ {listing!.averageRating ? Number(listing!.averageRating).toFixed(2) : 'No Ratings'} ⚪️ {totalReviews} review{Number(totalReviews) > 1 && 's'}</h1>
                                            <div className="review-options">
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
                                                    }}>{isAddingReview ? 'X' : '+'}</div>
                                                )}
                                            </div>
                                        </div>
                                        {isAddingReview && (
                                            <form className="add-review-form" onSubmit={handleAddReview}>
                                                <div className="add-review-header">
                                                    <input id="title" name="title" required/>
                                                    <select id="rating" name="rating" required>
                                                        <option value="5">5</option>
                                                        <option value="4">4</option>
                                                        <option value="3">3</option>
                                                        <option value="2">2</option>
                                                        <option value="1">1</option>
                                                    </select>
                                                </div>
                                                <textarea id="content" name="content"></textarea>
                                                <button type="submit" disabled={createReviewLoading}>{createReviewLoading ? 'Creating Review' : 'Create Review'}</button>
                                            </form>
                                        )}
                                        <div className="margin-top">
                                            <ReviewList data={reviews} numberOfPages={numberOfPages as number} page={page as number} totalReviews={totalReviews as number} changePage={setPage} updateSearch={getListingReviews} _id={id!}/>
                                        </div>
                                    </>
                                )}
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
        .did-reserve {
            display: flex;
            align-items: center;
            outline: 1px solid black;
            margin-bottom: 1rem;
            padding: 0.25rem;
            border-radius: 0.5rem;
            svg {
                margin-right: 0.5rem;
            }
            a {
                color: black;
            }
        }
        .container {
            display: flex;
            margin-top: 1rem;
            .left-side {
                width: 50%;
            }
            .right-side {
                width: 50%;
                .payment-box {
                    outline: 1px solid black;
                    width: 70%;
                    margin: 0 auto;
                    padding: 1rem;
                    .payment-info {
                        margin-top: 0.5rem;
                        border-bottom: 1px solid black;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    label {
                        display: block;
                        text-align: center;
                        margin-top: 0.5rem;
                    }
                    input, button {
                        width: 100%;
                        margin-top: 0.5rem;
                        padding: 0.25rem;
                    }
                    button {
                        width: 100%;
                        padding: 0.25rem;
                    }
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
`;

export default SingleListing;