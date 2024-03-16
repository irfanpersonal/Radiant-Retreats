import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useNavigate, useParams} from 'react-router-dom';
import {getSingleReservation} from '../features/reservation/reservationThunk';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ImageViewer} from '../components';
import {MdArrowDropDown} from "react-icons/md";
import {IoMdArrowDropup} from "react-icons/io";
import {Link} from 'react-router-dom';

const SingleReservation: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {getSingleReservationLoading, reservation} = useSelector((store: useSelectorType) => store.reservation);
    const {user} = useSelector((store: useSelectorType) => store.user);
    const [showAddress, setShowAddress] = React.useState(false);
    const [showTotal, setShowTotal] = React.useState(false);
    React.useEffect(() => {
        dispatch(getSingleReservation(id!));
    }, []);
    return (
        <Wrapper>
            {getSingleReservationLoading ? (
                <Loading title="Loading Single Reservation" position='normal'/>
            ) : (
                <>
                    <div className="reservation-container">
                        <div className="reservation-image">
                            <ImageViewer data={reservation!.listing.photos} viewType='advanced' fullWidth={false}/>
                        </div>
                        <div>
                            <div className="reservation-detail">
                                <div>Name:</div>
                                <div>{reservation!.listing.name}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Description:</div>
                                <div>{reservation!.listing.description}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Housing Capacity:</div>
                                <div>{reservation!.listing.housingCapacity}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Bedrooms:</div>
                                <div>{reservation!.listing.bedrooms}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Beds:</div>
                                <div>{reservation!.listing.beds}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Baths:</div>
                                <div>{reservation!.listing.baths}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Property Type:</div>
                                <div>{reservation!.listing.propertyType.charAt(0).toUpperCase() + reservation!.listing.propertyType.slice(1)}</div>
                            </div>
                            <div className="reservation-detail">
                                <div>Country:</div>
                                <div>{reservation!.listing.country}</div>
                            </div>
                            <Link to={`/listing/${reservation!.listingId}`}>View More Information</Link>
                        </div>
                    </div>
                    <div className="user-container">
                        <div>
                            {reservation!.listing.userId === user!.id ? (
                                <img onClick={() => {
                                    navigate(`/user/${reservation!.user.id}`);
                                }} src={reservation!.user.profilePicture || emptyProfilePicture} alt={reservation!.user.firstName}/>
                            ) : (
                                <img onClick={() => {
                                    navigate(`/user/${reservation!.listing.user.id}`);
                                }} src={reservation!.listing.user.profilePicture || emptyProfilePicture} alt={reservation!.listing.user.firstName}/>
                            )}
                        </div>
                        <div className="user-container-info">
                            {reservation!.listing.userId === user!.id ? (
                                <>
                                    <div>Guest Information</div>
                                    <div>{reservation!.user.firstName} {reservation!.user.lastName}</div>
                                    <div>Joined: {moment(reservation!.user.createdAt).format('MMMM Do, YYYY')}</div>
                                    <div>Email Address: {reservation!.user.email}</div>
                                </>
                            ) : (
                                <>
                                    <div>Host Information</div>
                                    <div>{reservation!.listing.user.firstName} {reservation!.listing.user.lastName}</div>
                                    <div>Joined: {moment(reservation!.listing.user.createdAt).format('MMMM Do, YYYY')}</div>
                                    <div>Email Address: {reservation!.listing.user.email}</div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="date-container">
                        <div className="date-detail">
                            <div>{moment(reservation!.startDate).utc().format('MMMM Do YYYY')}</div>
                            <div>Start Date</div>
                        </div>
                        <div className="date-detail">
                            <div>{moment(reservation!.endDate).utc().format('MMMM Do YYYY')}</div>    
                            <div>End Date</div>
                        </div>
                    </div>
                    {reservation!.listing.userId !== user!.id && (
                        <>
                            <div className="address" onClick={() => {
                                setShowAddress(currentState => {
                                    return !currentState;
                                });
                            }}> 
                                <div>View Address</div>
                                <div className="icon">{showAddress ? <IoMdArrowDropup/> : <MdArrowDropDown/>}</div>
                            </div>
                            {showAddress && (
                                <div className="address-info">{reservation!.listing?.address}</div>
                            )}
                            <div className="total" onClick={() => {
                                setShowTotal(currentState => {
                                    return !currentState;
                                });
                            }}> 
                                <div>View Total</div>
                                <div className="icon">{showTotal ? <IoMdArrowDropup/> : <MdArrowDropDown/>}</div>
                            </div>
                            {showTotal && (
                                <div className="total-info">Your total payment for this reservation is ${Number(reservation!.total) / 100}</div>
                            )}
                        </>
                    )}
                    {reservation!.listing.userId !== user!.id && (
                        <Link to={`/listing/${reservation!.listingId}`}>Create / View Reviews</Link>
                    )}
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .reservation-container {    
        display: flex;
        .reservation-image {
            margin-right: 1rem;
        }
        .reservation-detail {
            :first-child {
                background-color: lightgray;
                border-radius: 0.5rem;
                padding: 0 0.25rem; 
            }
            div {
                display: inline;
            }
            margin-bottom: 0.25rem;
            :first-child {
                margin-right: 0.25rem;
            }
        }
    }
    .user-container {
        outline: 1px solid black;
        display: flex;
        margin-top: 1rem;
        padding: 0.5rem;
        img {
            cursor: pointer;
            margin-left: 0.5rem;
            margin-top: 0.5rem;
            width: 5rem;
            height: 5rem;
            margin-right: 1rem;
            outline: 1px solid black;
        }
        .user-container-info {
            display: flex;
            flex-direction: column;
        }
    }
    .date-container {
        margin-top: 1rem;
        display: flex;
        align-items: center;
        .date-detail {
            width: 50%;
            outline: 1px solid black;
            padding: 1rem;
            text-align: center;
        }
    }
    .address, .total {
        cursor: pointer;
        user-select: none;
        outline: 1px solid black;
        margin: 1rem 0; 
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
            outline: 1px solid black;
            padding: 0 0.5rem;
        }
    }
    .address-info, .total-info {
        background-color: lightgray;
        margin-bottom: 0.5rem;
        padding: 1rem;
        outline: 1px solid black;
    }
    a {
        display: inline-block;
        margin-top: 1rem;
        color: black;
    }
`;  

export default SingleReservation;