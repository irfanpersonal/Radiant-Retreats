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
                    <div className="containerMin">
                        <div className="containerMain">
                            
                            <div className="mcLeft">
                                <img className="userImg" src={hostRequest!.user.profilePicture || emptyProfilePicture} alt={hostRequest!.user.name}/>
                            </div>
                            
                            <div className="mcRight">
                                <div className="userMeta">
                                    <div className="umCombo">
                                        <div className="umItem">
                                            <span>First Name:</span>
                                            <div>{capitalizeFirstLetter(hostRequest!.user.firstName)}</div>
                                        </div>
                                        <div className="umItem">
                                            <span>Last Name:</span>
                                            <div>{capitalizeFirstLetter(hostRequest!.user.lastName)}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="umCombo">
                                        <div className="umItem">
                                            <span>Birthday:</span>
                                            <div>{moment(hostRequest!.user.birthdate).utc().format('MM-DD-YYYY')}</div>
                                        </div>
                                        <div className="umItem">
                                            <span>Phone:</span>
                                            <div>{phone(hostRequest!.phoneNumber).isValid ? phone(hostRequest!.phoneNumber).phoneNumber : hostRequest!.phoneNumber}</div>
                                        </div>
                                    </div>
                        

                                    <div className="umCombo">
                                        <div className="umItem">
                                            <span>Country:</span>
                                            <div>{hostRequest!.user.country}</div>
                                        </div>
                                        <div className="umItem">
                                            <span>Language:</span>
                                            <div>{hostRequest!.user.language}</div>
                                        </div>
                                    </div>
                    
                                    
                                </div>

                                <div className="userRequest">
                         

                                    <div className="view-box" onClick={() => {
                                        setView(currentState => {
                                            return {...currentState, governmentIssuedID: !currentState.governmentIssuedID};
                                        });
                                    }}>
                                        <div>View Government Issued ID</div>
                                        <div className="icon">{view.governmentIssuedID ? <IoMdArrowDropup/> : <MdArrowDropDown/>}</div>
                                    </div>
                                    {view.governmentIssuedID && (
                                        <div className="reveal">
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
                                        <div className="reveal">
                                            <img id="nice-image" src={hostRequest!.backgroundCheck} alt={`${hostRequest!.user.firstName} ${hostRequest!.user.lastName}`}/>
                                        </div>
                                    )}
                                    <div className="status-box">
                                        <div>Status: <span className={`circle ${hostRequest!.status === 'accepted' ? 'green' : hostRequest!.status === 'pending' ? 'yellow' : hostRequest!.status === 'rejected' && 'red'}`}></span></div>
                                        <div>{capitalizeFirstLetter(hostRequest!.status)}</div>
                                    </div>
                                </div>
                                
                                {hostRequest!.status === 'pending' && (
                                <>
                                    {editSingleHostRequestLoading ? (
                                        <div>🕕</div>
                                    ) : (
                                        <div className="actionRow">
                                            <button className="approve" onClick={() => 
                                                {
                                                    dispatch(updateSingleHostRequest({id: id!, data: 'accepted'}));
                                                }}>Approve Request
                                            </button>
                                            <button className="reject" onClick={() => 
                                                {
                                                    dispatch(updateSingleHostRequest({id: id!, data: 'rejected'}));
                                                }}>Reject
                                            </button>
                                        </div>
                                    )}
                                </>
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
    .containerMain {
        display:flex;
        flex-direction:row;
        padding-top:50px;
        .mcRight {
            flex:1;
            display:flex;
            flex-direction:column;
            padding-left:40px;
        }
    }
    .userImg {
        margin: auto;
        width: 100%;
        height: 200px;
        display: block;
        object-fit: cover;
        object-position: center;
        margin-top: 10px;
        border-radius: 20px;
    }
    .userMeta {
        padding:10px;
        .umCombo {
            display:flex;
            flex-direction:row;
            .umItem {
                flex:1;
                display:flex;
                flex-direction:column;
                padding:10px;
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
    .userRequest {
        margin-top:20px;
        border-radius: 20px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
    }
    .view-box {
        padding:20px;
        font-size:14px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content: space-between;
        border-bottom:1px solid #e7e7e7;
    }
    .reveal {
        padding:50px 50px;
        background-color:#FFFFFF;
        border-bottom:1px solid #e7e7e7;
    }
    #nice-image {
        width:100%;
        margin:auto;
        display:block;
        object-fit:contain;
    }
    .status-box {
        padding:20px;
        font-size:14px;
        div {
            display:flex;
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
    .actionRow {
        gap:20px;
        display:flex;
        flex-direction:row;
        padding:20px 0px;
        button.approve {
            height: 49px;
            padding: 0px 60px;
            color: #FFFFFF;
            font-weight: 500;
            border-width: 0px;
            border-radius: 12px;
            background-color: #2d814e;
            cursor:pointer;
        }
        button.reject {
            height: 49px;
            padding: 0px 60px;
            color: #FFFFFF;
            font-weight: 500;
            border-width: 0px;
            border-radius: 12px;
            background-color: #d13b53;
            cursor:pointer;
        }
    }
    
    .status-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .circle {
            display:flex;
            min-width:20px;
            min-height:20px;
            border-radius:8px;
            margin-left:10px;
        }
        .yellow {
            background-color: gold;
        }
        .green {
            background-color: #2d814e;
        }
        .red {
            background-color: #d13b53;
        }
    }
    @media (max-width:768px) {
        .containerMain {
            padding-top:30px;
            flex-direction:column;
        }
        .containerMain .mcLeft {
            padding:0px 30px;
        }
        .containerMain .mcRight {
            padding-left:0px;
            .userMeta {
                padding:30px;
            }
            .userRequest {
                margin:0px 30px;
            }
        }
        .userImg {
            margin-top:0px;
        }
    }
`;

export default SingleHostRequest;