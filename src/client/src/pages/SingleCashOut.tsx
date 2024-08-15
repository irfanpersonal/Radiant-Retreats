import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useParams} from 'react-router-dom';
import {getSingleCashOut, updateSingleCashOut} from '../features/cashOut/cashOutThunk';
import {Loading, Modal} from '../components';
import {MdPerson, MdAccountCircle, MdLocalAtm} from 'react-icons/md';
import {TbNumbers} from "react-icons/tb";
import {capitalizeFirstLetter} from '../utils';
import {setShowConfirmPayoutModal} from '../features/cashOut/cashOutSlice';

const SingleCashOut: React.FunctionComponent = () => {
    const {id} = useParams();
    const [showSensitiveInfo, setShowSensitiveInfo] = React.useState<boolean>(false);
    const dispatch = useDispatch<useDispatchType>();
    const {getSingleCashOutLoading, cashOut, showConfirmPayoutModal, updateSingleCashOutLoading} = useSelector((store: useSelectorType) => store.cashOut);
    const toggleModal = () => {
        dispatch(setShowConfirmPayoutModal(!showConfirmPayoutModal));
    }
    const {user} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getSingleCashOut(id!));
    }, []);
    return (
        <Wrapper>
            {getSingleCashOutLoading ? (
                <Loading title="Loading Single Cash Out" position='normal'/>
            ) : (
                <div className='containerMin'>
                    <div className="mainContainer">
                        <div className="mcLeft">
                            <img className="userProfileIco" src={cashOut!.user.profilePicture || emptyProfilePicture} alt={`${cashOut!.user.firstName} ${cashOut!.user.lastName}`}/>
                            <div className="paneBox">
                                <div className="userInfoItem">
                                    <div><MdPerson/></div>
                                    <div>{showSensitiveInfo ? `${cashOut!.fullName}` : 'Full Name'}</div>
                                </div>
                                <div className="userInfoItem">
                                    <div><MdAccountCircle/></div>
                                    <div>{showSensitiveInfo ? `${cashOut!.accountNumber}` : 'Account Number'}</div>
                                </div>
                                <div className="userInfoItem">
                                    <div><MdLocalAtm/></div>
                                    <div>{showSensitiveInfo ? `${cashOut!.routingNumber}` : 'Routing Number'}</div>
                                </div>
                                <button onClick={() => {
                                    setShowSensitiveInfo(currentState => {
                                        return !currentState;
                                    });
                                }}>{showSensitiveInfo ? 'Hide' : 'View'}</button>
                            </div>
                            
                        </div>
                    
                        <div className="mcRight">
                            

                            <div className="mcRightMain">    
                                <div className="userInfo">
                                    <div className="ucComboBox">
                                        <div className="comboItem">
                                            <span>Name:</span>
                                            <div>{cashOut!.user.firstName} {cashOut!.user.lastName}</div>
                                        </div>
                                        <div className="comboItem">
                                            <span>Email Address:</span>
                                            <div>{cashOut!.user.email}</div>
                                        </div>
                                    </div>

                                    <div className="ucComboBox">
                                        <div className="comboItem">
                                            <span>Birthday:</span>
                                            <div>{moment(cashOut!.user.birthdate).utc().format('YYYY-MM-DD')}</div>
                                        </div>
                                        <div className="comboItem">
                                            <span>Country:</span>
                                            <div>{cashOut!.user.country}</div>
                                        </div>
                                    </div>


                                    <div className="ucComboBox">
                                        <div className="comboItem">
                                            <span>Language:</span>
                                            <div>{cashOut!.user.language}</div>
                                        </div>
                                        <div className="comboItem">
                                            <span>Role:</span>
                                            <div>{capitalizeFirstLetter(cashOut!.user.role)}</div>
                                        </div>
                                    </div>


                                </div>

                                <div className="userCashout">
                                    <div className="cashoutCombo">
                                        <div className="comboItem">
                                            <span>Amount: </span>
                                            <div>${cashOut!.amount}</div>
                                        </div>
                                    </div>

                                    

                                    <div className="cashoutCombo">
                                        <div className="comboItem">
                                            <span>Status: </span>
                                            <div>{capitalizeFirstLetter(cashOut!.status)} <div className={`status-ball ${cashOut!.status === 'paid' ? 'green' : 'yellow'}`}></div></div>
                                        </div>
                                    </div>

                                    <div className="cashoutCombo">
                                        <div className="comboItem">
                                            <span>Created:</span>
                                            <div>{moment(cashOut!.createdAt).utc().format('MMMM Do YYYY h:mm:ss a')}</div>
                                        </div>
                                    </div>

                                    {moment(cashOut!.createdAt).utc().format('MMMM Do YYYY, h:mm:ss a') !== moment(cashOut!.updatedAt).utc().format('MMMM Do YYYY, h:mm:ss a') && (
                                    <div className="cashoutCombo">
                                        <div className="comboItem">
                                            <span>Updated At:</span>
                                            <div> {moment(cashOut!.updatedAt).utc().format('MMMM Do YYYY, h:mm:ss a')}</div>
                                        </div>
                                    </div>
                                    )}
                                </div>

                                {user!.role === 'admin' && (
                                    <div className="cashoutAction">
                                        {cashOut!.status === 'pending' && (
                                            <button onClick={toggleModal}>Pay</button>
                                        )}
                                    </div>
                                )}

                            </div>                            
                        </div>
                    </div>
                    
                    
                    
                </div>
            )}
            {showConfirmPayoutModal && (
                <Modal title="Confirm Payment" toggleModal={toggleModal}>
                    <div>Are you absolutely certain you've made the payment? Remember, from the user's perspective, it will appear as though it's been completed. Please ensure you're completely confident before clicking "confirm."</div>
                    <button className="submitModal" onClick={() => {
                        dispatch(updateSingleCashOut({status: 'paid', cashOutId: id!}));
                    }} style={{width: '100%'}} disabled={updateSingleCashOutLoading}>{updateSingleCashOutLoading ? 'Confirming' : 'Confirm'}</button>
                </Modal>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .mainContainer {
        display:flex;
        flex-direction:row;
        padding-top:50px;
    }
    .mcLeft {
        width:300px;
        .userProfileIco {
            margin:auto;
            width: 100%;
            height: 200px;
            display:block;
            object-fit:cover;
            object-position:center;
            margin-bottom:25px;
            border-radius: 20px;
        }
        .paneBox {
            flex:1;
            display: flex;
            padding: 12px;
            flex-direction: column;
            border-radius: 20px;
            background-color: #F5F5F4;
            border: 1px solid rgba(17, 17, 17, 0.04);
            button {
                height: 48px;
                color: #FFFFFF;
                font-weight: 500;
                border-radius: 12px;
                background-color: #717171;
                border-width: 0px;
                margin-top:12px;
            }
            .userInfoItem {
                flex:1;
                margin:0px 15px;
                padding:12px 0px;
                display:flex;
                flex-direction:row-reverse;
                align-items:center;
                justify-content: space-between;
                border-bottom:1px solid rgba(17, 17, 17, 0.04);
                div {
                    font-size:14px;
                }
            }
        }
    }
    .mcRight {
        flex:1;
        display:flex;
        flex-direction:row;
        padding-left:40px;
        .mcRightMain {
            flex:1;
            display:flex;
            flex-direction:column;
            .userInfo {
                padding:10px;
                .ucComboBox {
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                    .comboItem {
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
            .userCashout {
                padding:10px;
                border-radius:20px;
                background-color: #F5F5F4;
                border: 1px solid rgba(17, 17, 17, 0.04);
                .cashoutCombo {
                    display:flex;
                    flex-direction:row;
                    align-items:center;
                    .comboItem {
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
        }
    }
    .cashoutAction {
        display:flex;
        flex-direction:row;
        padding:20px 0px;
        button {
            width:250px;
            max-width:100%;
            height: 48px;
            color: #FFFFFF;
            font-weight: 500;
            border-radius: 12px;
            background-color: #2d814e;
            border-width: 0px;
            margin-top: 12px;
            
        }
    }
    .submitModal {
        height: 48px;
        color: #FFFFFF;
        font-weight: 500;
        border-radius: 12px;
        background-color: #2d814e;
        border-width: 0px;
        margin-top:20px;
    }
    @media (max-width:768px) {
        .containerMin {
            padding:0px 30px;
        }
        .mainContainer {
            padding-top:30px;
            flex-direction:column;
        }
        .mcRight {
            padding-left:0px;
        }
        .mcLeft {
            width:100%;
            margin-bottom:20px;
        }
        .userCashout {
            margin-top:20px;
            margin-bottom:30px;
        }
        .cashoutAction {
            padding-top:0px;
            padding-bottom:30px;
            button {
                margin-top:0px;
            }
        }
    }
`;

export default SingleCashOut;