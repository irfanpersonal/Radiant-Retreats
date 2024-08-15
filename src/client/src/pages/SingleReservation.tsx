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
        <Wrapper className="containerMin">
            {getSingleReservationLoading ? (
                <Loading title="Loading Single Reservation" position='normal'/>
            ) : (
                <>

                    <div className="reservation-image">
                        <ImageViewer data={reservation!.listing.photos} viewType='advanced' fullWidth={false}/>
                    </div>
                    <div className="mainWrapper">
                    <div className="leftSide">
                        
                        <div className="reservationTitle">{reservation!.listing.name}</div>
                        <div>
                            <div className="reservation-detail-description">
                                <span>Description:</span>
                                <div>{reservation!.listing.description}</div>
                            </div>

                            <div className="reservationMeta">
                                <div className="rmCombo">
                                    <div className="rmItem">
                                        <span>Capacity:</span>
                                        <div>{reservation!.listing.housingCapacity}</div>
                                    </div>
                                    <div className="rmItem">
                                        <span>Bedrooms:</span>
                                        <div>{reservation!.listing.bedrooms}</div>
                                    </div>
                                </div>
                              
                                <div className="rmCombo">
                                    <div className="rmItem">
                                        <span>Beds:</span>
                                        <div>{reservation!.listing.beds}</div>
                                    </div>
                                    <div className="rmItem">
                                        <span>Baths:</span>
                                        <div>{reservation!.listing.baths}</div>
                                    </div>
                                </div>
                          
                                <div className="rmCombo">
                                    <div className="rmItem">
                                        <span>Property Type:</span>
                                        <div>{reservation!.listing.propertyType.charAt(0).toUpperCase() + reservation!.listing.propertyType.slice(1)}</div>
                                    </div>
                                    <div className="rmItem">
                                        <span>Country:</span>
                                        <div>{reservation!.listing.country}</div>
                                    </div>
                                </div>
                                
                            </div>
                            
                            <Link className="moreInfoButton" to={`/listing/${reservation!.listingId}`}>More Information</Link>
                        </div>
                    </div>

                    <div className="rightSide">
                        <div className="rightPanel">
                        <div className="userInformation">
                            <div className="userImgWrapper">
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
                                        <div className="uciItem">
                                            <span>Guest:</span>
                                            <div className="titleName">{reservation!.user.firstName} {reservation!.user.lastName}</div>
                                        </div>

                                        {/* <div className="uciItem">
                                            <span>Joined:</span>
                                            <div>{moment(reservation!.user.createdAt).format('MMMM Do, YYYY')}</div>
                                        </div>

                                        <div className="uciItem">
                                            <span>Email:</span>
                                            <div>{reservation!.user.email}</div>
                                        </div> */}
                                    </>
                                ) : (
                                    <>
                                        <div className="uciItem">
                                            <span>Host:</span>
                                            <div className="titleName">{reservation!.listing.user.firstName} {reservation!.listing.user.lastName}</div>
                                        </div>
                                        {/* <div className="uciItem">
                                            <span>Joined:</span>
                                            <div>{moment(reservation!.listing.user.createdAt).format('MMMM Do, YYYY')}</div>
                                        </div>
                                        <div className="uciItem">
                                            <span>Email:</span>
                                            <div>{reservation!.listing.user.email}</div>
                                        </div> */}

                                    </>
                                )}
                            </div>
                        </div>
                        <div className="date-container">
                            <div className="date-detail">
                                <div>{moment(reservation!.startDate).utc().format('MMMM Do YYYY')}</div>
                                <span>Start Date</span>
                            </div>
                            <div className="date-detail">
                                <div>{moment(reservation!.endDate).utc().format('MMMM Do YYYY')}</div>    
                                <span>End Date</span>
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
                            <Link className="viewButton" to={`/listing/${reservation!.listingId}`}>View Listing</Link>
                        )}
                    </div>
                    </div>
                    </div>
                    
                    
                    
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .mainWrapper {
        display:flex;
        flex-direction:row;
    }
    .leftSide {
        display:flex;
        flex-direction:column;
        flex:1;
    }
    .rightSide {
        width:300px;
        margin-left:40px;
    }
    .rightPanel {
        border-radius: 20px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
    }
    .reservationTitle {
        font-size:24px;
        font-weight:500;
        margin-bottom:30px;
    }
    .reservation-detail-description {
        padding: 30px 0px;
        border-top: 1px solid #e7e7e7;
        span {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 20px;
            display:flex;
        }
        div {
            font-size:14px;
        }
    }
    .reservationMeta {
        padding:12px;
        border-radius: 20px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
        .rmCombo {
            display:flex;
            flex-direction:row;
            .rmItem {
                flex:1;
                display:flex;
                flex-direction:column;
                padding:12px;
                span {
                    color: #717171;
                    font-size: 12px;
                    margin-bottom: 10px;
                }
                div {
                    font-size:14px;
                }
            }
        }
    }
    .userInformation {
        display:flex;
        flex-direction:row;
        padding:0px 10px;
        .userImgWrapper {
            padding:12px;
            padding-right:0px;
            display:flex;
            align-items: center;
            img {
                width: 60px;
                height: 60px;
                border-radius: 12px;
                box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
            }
        }
        
    }
    .user-container-info {
        flex:1;
        display:flex;
        flex-direction:column;
        padding:12px;
        .uciItem {
            padding:10px;
            span {
                color: #717171;
                font-size: 12px;
                margin-bottom: 10px;
            }
            div {
                font-size:14px;
            }
            .titleName {
                font-size:14px;
                font-weight:600;
            }
        }
    }
    .viewButton {
        margin:20px;
        height: 48px;
        font-size:14px;
        color: #FFFFFF;
        font-weight: 500;
        border-radius: 12px;
        background-color: #2d814e;
        border-width: 0px;
        display:flex;
        align-items: center;
        justify-content: center;
        text-decoration:none;
    }
    .address , .total {
        padding:20px;
        font-size:14px;
        font-weight:600;
        display:flex;
        flex-direction:row;
        align-items: center;
        justify-content: space-between;
        border-bottom:1px solid #e7e7e7;
    }
    .address-info , .total-info {
        padding:20px;
        font-size:14px;
        background-color:#ffffff;
        border-bottom:1px solid #e7e7e7;
    }
    .reservation-container {    
        display: flex;
        flex-direction:column;
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
    }
    .date-container {
        display: flex;
        align-items: center;
        padding:20px 0px;
        background-color:#FFFFFF;
        border-top:1px solid #e7e7e7;
        border-bottom:1px solid #e7e7e7;
        .date-detail {
            width: 50%;
            text-align:center;
            span {
                color: #717171;
                font-size: 12px;
                margin-bottom: 10px;
            }
            div {
                font-size:14px;
                font-weight:600;
                color:#717171;
            }
        }
    }
    
    a {
        display: inline-block;
        margin-top: 1rem;
        color: black;
    }
    .moreInfoButton {
        margin: 20px 0px;
        height: 48px;
        font-size: 14px;
        color: #FFFFFF;
        font-weight: 500;
        border-radius: 12px;
        background-color: #2d814e;
        border-width: 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        margin-bottom:50px;
    }
    @media (max-width:768px) {
        .mainWrapper {
            flex-direction:column-reverse;
        }
        .main-container {
            margin:30px 30px;
        }
        .rightSide {
            width:100%;
            margin-left:0px;
            padding:0px 30px;
        }
        .leftSide {
            padding:30px;
        }
        .moreInfoButton {
            margin-top:30px;
            margin-bottom:0px;
        }
    }
`;  

export default SingleReservation;