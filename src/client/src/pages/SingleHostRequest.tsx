import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {phone} from 'phone';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getSingleHostRequest, updateSingleHostRequest} from '../features/hostRequest/hostRequestThunk';
import {Loading} from '../components';
import {FaArrowAltCircleLeft, FaTimesCircle, FaCheckCircle, FaPhone, FaMap} from 'react-icons/fa';
import {capitalizeFirstLetter} from '../utils';
import {MdArrowDropDown} from "react-icons/md";
import {IoMdArrowDropup} from "react-icons/io";

const SingleHostRequest: React.FunctionComponent = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const [view, setView] = React.useState({
        governmentIssuedID: false,
        backgroundCheck: false
    });
    const {getSingleHostRequestLoading, hostRequest, editSingleHostRequestLoading} = useSelector((store: useSelectorType) => store.hostRequest);
    React.useEffect(() => {
        dispatch(getSingleHostRequest(id!));
    }, []);
    return (
        <Wrapper>
            {getSingleHostRequestLoading ? (
                <Loading title="Loading Host Request" position='normal'/>
            ) : (
                <>
                    <div className="host-request-header">
                        <div className="icon back" onClick={() => navigate(-1)}>
                            <div><FaArrowAltCircleLeft/></div>
                        </div>
                        {hostRequest!.status === 'pending' && (
                            <>
                                {editSingleHostRequestLoading ? (
                                    <div>🕕</div>
                                ) : (
                                    <div className="host-request-header-options">
                                        <div title="Reject" onClick={() => {
                                            dispatch(updateSingleHostRequest({id: id!, data: 'rejected'}));
                                        }}><FaTimesCircle className="cancel"/></div>
                                        <div title="Accept" onClick={() => {
                                            dispatch(updateSingleHostRequest({id: id!, data: 'accepted'}));
                                        }}><FaCheckCircle className="accept"/></div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <h1 className="title">User Details</h1>
                    <div className="user-container">
                        <div>
                            <img className="user-pfp" src={hostRequest!.user.profilePicture || emptyProfilePicture} alt={hostRequest!.user.name}/>
                        </div>   
                        <div>
                            <p><span>First Name:</span>{capitalizeFirstLetter(hostRequest!.user.firstName)}</p>
                            <p><span>Last Name:</span>{capitalizeFirstLetter(hostRequest!.user.lastName)}</p>
                            <p><span>Birthday:</span>{moment(hostRequest!.user.birthdate).utc().format('MM-DD-YYYY')}</p>
                            <p><span>Country:</span>{hostRequest!.user.country}</p>
                            <p><span>Language:</span>{hostRequest!.user.language}</p>
                        </div> 
                    </div>
                    <div className="host-request-container">  
                        <div className="host-request-container-header">
                            <div className="host-request-detail">
                                <div><FaPhone/>Phone Number</div>
                                <div>{phone(hostRequest!.phoneNumber).isValid ? phone(hostRequest!.phoneNumber).phoneNumber : hostRequest!.phoneNumber}</div>
                            </div>
                        </div>
                        <div className="view-box" onClick={() => {
                            setView(currentState => {
                                return {...currentState, governmentIssuedID: !currentState.governmentIssuedID};
                            });
                        }}>
                            <div>View Government Issued ID</div>
                            <div className="icon">{view.governmentIssuedID ? <IoMdArrowDropup/> : <MdArrowDropDown/>}</div>
                        </div>
                        {view.governmentIssuedID && (
                            <div>
                                <img id="nice-image" src={hostRequest!.governmentIssuedID} alt={`${hostRequest!.user.firstName} ${hostRequest!.user.lastName}`}/>
                            </div>
                        )}
                        <div className="view-box" onClick={() => {
                            setView(currentState => {
                                return {...currentState, backgroundCheck: !currentState.backgroundCheck};
                            });
                        }}>
                            <div>View Background Check</div>
                            <div className="icon">{view.governmentIssuedID ? <IoMdArrowDropup/> : <MdArrowDropDown/>}</div>
                        </div>
                        {view.backgroundCheck && (
                            <div>
                                <img id="nice-image" src={hostRequest!.backgroundCheck} alt={`${hostRequest!.user.firstName} ${hostRequest!.user.lastName}`}/>
                            </div>
                        )}
                        <div className="status-box">
                            <div>Status: <span className={`circle ${hostRequest!.status === 'accepted' ? 'green' : hostRequest!.status === 'pending' ? 'yellow' : hostRequest!.status === 'rejected' && 'red'}`}></span></div>
                            <div>{capitalizeFirstLetter(hostRequest!.status)}</div>
                        </div>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .host-request-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid black;
        .host-request-header-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            svg {
                cursor: pointer;
                margin-left: 1rem;
                font-size: 1.5rem;
            }
        }
    }
    .user-container {
        display: flex;
        padding-bottom: 1rem;
        border-bottom: 1px solid black;
        img {
            outline: 1px solid black;
        }
        p {
            margin-right: 0.25rem;
            margin-bottom: 0.5rem;
            span {
                margin-right: 0.25rem;
            }
            input, select {
                padding: 0 0.25rem;
            }
        }
        .btn {
            display: inline-block;
            margin-right: 0.5rem;
            cursor: pointer;
            margin-top: 0.5rem;
            width: 25%;
            text-align: center;
            padding: 0.25rem;
            outline: 1px solid black;
        }
        .btn:hover, .btn:active {
            background-color: gray;
            color: white;
        }
        .user-pfp {
            width: 10rem;
            height: 10rem;
            margin-right: 1rem;
        }
        a {
            color: black;
        }
        .role {
            background-color: black;
            color: white;
            width: 10rem;
            text-align: center;
        }
    }
    .host-request-container {
        margin-top: 1rem;
        /*  */
        .host-request-container-header {
            display: flex;
            flex-direction: column;
            .host-request-detail {
                display: flex;
                justify-content: space-between;
                align-items: center;
                outline: 1px solid black;
                padding: 1rem;
                svg {
                    margin-right: 1rem;
                }
            }
        }
        .host-request-detail {
            margin-bottom: 1rem;
        }
        img {
            margin: 0 auto;
            display: block;
            width: 10rem;
            height: 10rem;
            outline: 1px solid black;
        }
    } 
    .back:hover, .back:active {
        color: gray;
    }
    .cancel:hover, .cancel:active {
        color: red;
    }  
    .accept:hover, .accept:active {
        color: green;
    }
    .icon {
        cursor: pointer;
    }
    .view-box {
        cursor: pointer;
        user-select: none;
        outline: 1px solid black;
        margin-bottom: 1rem;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .icon {
            outline: 1px solid black;
            padding: 0 0.5rem;
        }
    }  
    #nice-image {
        margin-bottom: 1rem;
        width: 100%;
        height: 20rem;
    }
    .status-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .circle {
            margin-left: 0.5rem;
            outline: 1px solid black;
            padding: 0 0.75rem;
            border-radius: 50%;
        }
        .yellow {
            background-color: yellow;
        }
        .green {
            background-color: green;
        }
        .red {
            background-color: red;
        }
    }
`;

export default SingleHostRequest;