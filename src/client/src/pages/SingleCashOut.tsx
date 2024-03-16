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
                <div className='cash-out'>
                    <div className="cash-out-private">
                        <div className="cash-out-info">
                            <div><MdPerson/></div>
                            <div>{showSensitiveInfo ? `${cashOut!.fullName}` : 'Full Name'}</div>
                        </div>
                        <div className="cash-out-info">
                            <div><MdAccountCircle/></div>
                            <div>{showSensitiveInfo ? `${cashOut!.accountNumber}` : 'Account Number'}</div>
                        </div>
                        <div className="cash-out-info">
                            <div><MdLocalAtm/></div>
                            <div>{showSensitiveInfo ? `${cashOut!.routingNumber}` : 'Routing Number'}</div>
                        </div>
                        <button onClick={() => {
                            setShowSensitiveInfo(currentState => {
                                return !currentState;
                            });
                        }}>{showSensitiveInfo ? 'Hide' : 'View'}</button>
                    </div>
                    <div className="cash-out-general">
                        <div className="cash-out-general-container">
                            <div>
                                <img src={cashOut!.user.profilePicture || emptyProfilePicture} alt={`${cashOut!.user.firstName} ${cashOut!.user.lastName}`}/>
                            </div>
                            <div className="user-info">
                                <div>Name: {cashOut!.user.firstName} {cashOut!.user.lastName}</div>
                                <div>Birthday: {moment(cashOut!.user.birthdate).utc().format('YYYY-MM-DD')}</div>
                                <div>Email Address: {cashOut!.user.email}</div>
                                <div>Country: {cashOut!.user.country}</div>
                                <div>Language: {cashOut!.user.language}</div>
                                <div>Role: {capitalizeFirstLetter(cashOut!.user.role)}</div>
                            </div>
                        </div>
                        <div className="cash-out-options">
                            <div className="cash-out-option-info">
                                <div>Amount: ${cashOut!.amount}</div>
                            </div>
                            <div className="cash-out-option-info">
                                <div>Status: {capitalizeFirstLetter(cashOut!.status)}</div>
                                <div className={`status-ball ${cashOut!.status === 'paid' ? 'green' : 'yellow'}`}></div>
                            </div>
                            {moment(cashOut!.createdAt).utc().format('MMMM Do YYYY, h:mm:ss a') !== moment(cashOut!.updatedAt).utc().format('MMMM Do YYYY, h:mm:ss a') && (
                                <div className="cash-out-option-info">
                                    <div>Updated At: {moment(cashOut!.updatedAt).utc().format('MMMM Do YYYY, h:mm:ss a')}</div>
                                </div>
                            )}
                            <div className="cash-out-option-info">
                                <div>Created At: {moment(cashOut!.createdAt).utc().format('MMMM Do YYYY h:mm:ss a')}</div>
                            </div>
                            {user!.role === 'admin' && (
                                <>
                                    {cashOut!.status === 'pending' && (
                                        <button onClick={toggleModal}>PAY</button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showConfirmPayoutModal && (
                <Modal title="Confirm Payment" toggleModal={toggleModal}>
                    <div>Are you absolutely certain you've made the payment? Remember, from the user's perspective, it will appear as though it's been completed. Please ensure you're completely confident before clicking "confirm."</div>
                    <button onClick={() => {
                        dispatch(updateSingleCashOut({status: 'paid', cashOutId: id!}));
                    }} style={{width: '100%', padding: '0.25rem', marginTop: '0.5rem'}} disabled={updateSingleCashOutLoading}>{updateSingleCashOutLoading ? 'Confirming' : 'Confirm'}</button>
                </Modal>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .cash-out {
        display: flex;
        .cash-out-private {
            width: 30%;
            margin-right: 1rem;
            button {
                width: 100%;
                padding: 0.25rem;
            }
        }
        .cash-out-general {
            width: 70%;
            .cash-out-general-container {
                display: flex;
                border-bottom: 1px solid black;
                padding-bottom: 1rem;
            }
            img {
                width: 5rem;
                height: 5rem;
                outline: 1px solid black;
                margin-right: 1rem;
            }
            .cash-out-options {
                margin-top: 0.5rem;
                button {
                    width: 100%;
                    padding: 0.25rem;
                }
                .cash-out-option-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;  
                    outline: 1px solid black;
                    padding: 0.25rem;
                    margin-bottom: 1rem;
                    .status-ball {
                        width: 1rem;
                        height: 1rem;
                        border-radius: 50%;
                        outline: 1px solid black;
                    }
                    .green {
                        background-color: green;
                    }   
                    .yellow {
                        background-color: yellow;
                    }   
                }
            }
        }
        .cash-out-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            outline: 1px solid black;
            padding: 1rem;
            margin-bottom: 1rem;
        }
    }
`;

export default SingleCashOut;