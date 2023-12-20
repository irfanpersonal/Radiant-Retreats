import React from 'react';
import styled from 'styled-components';
import {deleteSingleListing, getSingleListing} from '../features/listing/listingThunk';
import {useDispatch, useSelector} from 'react-redux';
import {useParams, Link} from 'react-router-dom';
import {ListImage, ReservationBox, ReviewList, ReservationList} from '../components';
import {CiEdit, CiShare1, CiTrash} from "react-icons/ci";
import {FaArrowAltCircleLeft} from "react-icons/fa";
import {getAllReviews} from '../features/reviews/reviewsThunk.js';
import {getAllListingReservations} from '../features/reservations/reservationsThunk.js';

const SingleListing = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {isLoadingSingleListing, singleListing} = useSelector(store => store.listing);
    const {isLoadingReviews, reviews, averageRating} = useSelector(store => store.review);
    const {isLoadingListingReservations, reservations} = useSelector(store => store.reservations);
    React.useEffect(() => {
        dispatch(getSingleListing(id));
        dispatch(getAllReviews(id));
        dispatch(getAllListingReservations(id));
    }, []);
    return (
        <Wrapper>
            {isLoadingSingleListing ? (
                <h1>Single Listing Loading...</h1>
            ) : (
                <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid black'}}>
                        <Link to={`/`} style={{color: 'black'}}><h1><FaArrowAltCircleLeft/></h1></Link>
                        <h1>{singleListing.name}</h1>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {singleListing?.userDetails?.email === user?.email && (
                                <>
                                    <h1 onClick={() => dispatch(deleteSingleListing(id))}><CiTrash className="link"/></h1>
                                    <Link to={`/edit-listing/${id}`} style={{color: 'black'}}><h1><CiEdit className="link"/></h1></Link>
                                </>
                            )}
                            <h1 onClick={async() => {
                                if (navigator.clipboard) {
                                    await navigator.clipboard.writeText(window.location.href);
                                }
                            }}><CiShare1 className="link"/></h1>
                        </div>
                    </div>
                    <ListImage data={singleListing.photos}/>
                    <div className="listing-details">
                        <div className="left-side" style={{margin: user?.role === 'owner' && '0 auto', width: user?.role === 'owner' && '100%'}}>
                            <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>Listing Details</h1>
                            <p><span>Description:</span>{singleListing.description}</p>
                            <p><span>Location:</span>{singleListing.country}, {singleListing.city}</p>
                            <p><span>Doors:</span>{singleListing.rooms}</p>
                            <p><span>Restroom:</span>{singleListing.bathrooms}</p>
                            <p><span>Amenities:</span>{singleListing.amenities.map((amenity, index) => {
                            const isLastAmenity = index === singleListing.amenities.length - 1;
                                return isLastAmenity ? `and ${amenity}` : `${amenity}, `;
                            })}</p>
                            <p><span>Rules:</span>{singleListing.rules}</p>
                            <p><span>Price:</span>${singleListing.price}</p>
                            <p><span>Maintenance Fee:</span>${singleListing.maintenanceFee}</p>
                        </div>
                        {user?.role !== 'owner' && (
                            <ReservationBox/>
                        )} 
                    </div>
                    {isLoadingReviews ? (
                        <h1 style={{marginTop: '1rem'}}>Single Listing Reviews Loading...</h1>
                        ) : (
                        <>
                            {user?.role === 'customer' && (
                                <ReviewList data={reviews} averageRating={averageRating}/>
                            )}
                        </>
                    )}
                    {isLoadingListingReservations ? (
                        <h1>Loading Listing Reservations...</h1>
                    ) : (
                        <>
                            {(user?.role === 'owner' && (singleListing?.userDetails?.name === user?.name)) && (
                                <div style={{marginTop: '1rem'}}>
                                    <ReservationList title="My Orders" data={reservations}/>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .link {
        margin-left: 0.5rem;
        cursor: pointer;
        background-color: white;
    }
    .link:active {
        background-color: black;
        color: white;
    }
    img {
        width: 100%;
        height: 200px;
        border: 1px solid black;
        margin-top: 1rem;
    }
    .left-btn {
        background-color: white;
        border-radius: 1rem;
        position: absolute;
        top: 50%;
        left: 5%;
        cursor: pointer;
        font-size: 2rem;
    }
    .right-btn {
        background-color: white;
        border-radius: 1rem;
        position: absolute;
        top: 50%;
        right: 5%;
        cursor: pointer;
        font-size: 2rem;
    }
    .listing-details {
        background-color: white;
        border-radius: 1rem;
        padding: 1rem;
        display: flex;
    }
    p {
        margin-top: 1rem;
    }
    span {
        text-decoration: underline;
        margin-right: 0.25rem;
    }
    .left-side, .right-side {
        padding: 1rem;
        border: 1px solid black;
    }
    .left-side {
        width: 50%;
        margin-right: 1rem;
    }
    .right-side {
        width: 50%;
    }
    label {
        display: block;
        text-align: center;
        margin-top: 1rem;
    }
    input {
        display: block;
        margin: 0 auto;
    }
    button {
        margin-top: 1rem;
        padding: 0.5rem;
        width: 100%;
    }
`;

export default SingleListing;