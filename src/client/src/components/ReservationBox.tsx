import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import {type ListingType} from '../features/listing/listingSlice';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {toast} from 'react-toastify';
import {createPaymentIntent} from '../features/reservation/reservationThunk';
import {getBookedDateValues} from '../utils';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import { FaStar } from "react-icons/fa6";
import { CiCalendar } from "react-icons/ci";


interface ReservationBoxProps {
    data: ListingType
}

const ReservationBox: React.FunctionComponent<ReservationBoxProps> = ({data}) => {
    const {id: listingID} = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {createPaymentIntentLoading, paymentIntentData} = useSelector((store: useSelectorType) => store.reservation);
    const [startDate, setStartDate] = React.useState<string>('');
    const [endDate, setEndDate] = React.useState<string>('');
    const bookedDateValues = getBookedDateValues(data.bookedDates).map((date: any) => date.replace(/\//g, '-'));
    const handleCreatePaymentIntent = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user) {
            navigate('/auth');
            toast.error('You must register/login to make a reservation!');
            return;
        }
        dispatch(createPaymentIntent({listingID: listingID!, startDate, endDate}));
    }
    React.useEffect(() => {
        if (paymentIntentData) {
            navigate('/checkout');
        }
    }, [paymentIntentData]);
    return (
        <Wrapper>
            <form className="bookingBox" onSubmit={handleCreatePaymentIntent}>
                <div className="bookingBoxHead">
                    <h1>${((Number(data!.price) / 100))} <span> / night</span></h1>
                    <div className="listing-item-rating">
                        <FaStar size={'14px'} color={'#111111'}/>
                        <div className="listing-item-rating-label">{Number(data.averageRating) === 0 ? "New" : data.averageRating}</div>
                    </div>
                    
                </div>
                
                <div className="bookingBoxDetails">
                    <div className="bookingBoxDetailItem">
                        <label htmlFor="startDate" className="bookingBoxDetailLabel">Check in</label>
                        <div className="comboBox">
                            <CiCalendar/>
                            <Flatpickr id="startDate" name="startDate" value={startDate} onChange={(selectedDates) => {
                                setStartDate(currentState => {
                                    return String(moment(selectedDates[0]).format('YYYY-MM-DD'));
                                });
                            }} placeholder='mm/dd/yyyy' options={{
                                minDate: new Date().toISOString().split('T')[0],
                                disable: bookedDateValues
                            }}/>
                        </div>
                    </div>
                    <div className="bookingBoxDetailItem">
                        <label htmlFor="endDate" className="bookingBoxDetailLabel">Check out</label>
                        <div className="comboBox">
                            <CiCalendar/>
                            <Flatpickr id="endDate" name="endDate" value={endDate} onChange={(selectedDates) => {
                                setEndDate(currentState => {
                                    return String(moment(selectedDates[0]).format('YYYY-MM-DD'));
                                });
                            }} placeholder='mm/dd/yyyy' options={{
                                minDate: new Date().toISOString().split('T')[0],
                                disable: bookedDateValues
                            }}/>
                        </div>
                        
                    </div>
                </div>
                
                <div className="bookingBoxMeta">
                    <div className="bookingBoxMetaLine">
                        <div className="metaItem">Dates selected</div>
                        <div className="metaValue">{moment(endDate).diff(moment(startDate), 'day') + 1 ? moment(endDate).diff(moment(startDate), 'day') + 1 + ' nights' : 'No dates selected'}</div>
                    </div>

                    <div className="bookingBoxMetaLine">
                        <div className="metaItem">Maintenance fee</div>
                        <div className="metaValue">${Number(data!.maintenanceFee) / 100}</div>
                    </div>
                </div>
                
                
   
                {(moment(endDate).diff(moment(startDate), 'day') + 1) ? (
                    <div className="bookingTotal">
                        <div className="bookingTotalMeta">
                            <div className="bookingTotalItem">Total:</div> 
                            <div className="bookingTotalSubline">Incl. taxes</div>
                        </div>
                        <div className="bookingTotalValue">${((moment(endDate).diff(moment(startDate), 'day') + 1) * Number(data.price) + Number(data.maintenanceFee)) / 100}</div>
                    </div>
                ) : (   
                    null
                )}

                <div className="reserveWrapper">
                    <button className="reserveButton" type="submit" disabled={createPaymentIntentLoading}>{createPaymentIntentLoading ? 'Reserving' : 'Reserve'}</button>
                </div>
                
            </form>
        </Wrapper>
    );
}


const Wrapper = styled.div`
    .bookingBox {
        padding:12px;
        border-radius:20px;
        background-color:#F5F5F4;
        border:1px solid rgba(17, 17, 17, 0.04);
    }
    .bookingBoxHead {
        padding:12px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .bookingBoxHead h1 {
        font-size:24px;
        font-weight:500;
    }
    .bookingBoxHead span {
        color:#717171;
        font-size:14px;
        font-weight:400;
    }
    .listing-item-rating {
        display:flex;
        flex-direction:row;
        align-items:center;
    }
    .listing-item-rating svg {
        margin-top:-2px;
    }
    .listing-item-rating-label {
        color:#111111;
        font-size:14px;
        padding-left:8px;
    }
    .bookingBoxDetails {
        display:flex;
        flex-direction:column;
    }
    .bookingBoxDetailItem {
        flex:1;
        display:flex;
        flex-direction:column;
        padding: 12px;
    }
    .bookingBoxDetailLabel {
        color:#717171;
        font-size:12px;
        margin-bottom:10px;
    }
    .comboBox {
        flex:1;
        display:flex;
        flex-direction:row;
        align-items:center;
        position: relative;
    }
    .comboBox svg {
        color:#717171;
        font-size:20px;
        margin-left:10px;
        position:absolute;
        margin-top:-1px;
    }
    .comboBox input {
        flex:1;
        display:flex;
        border-width:0px;
        border-radius:12px;
        background-color:#FFFFFF;
        padding:14px 14px 14px 40px;
    }
    .bookingBoxMeta {
        margin:12px 12px;
        padding:12px 0px;
        border-top:1px solid rgba(17, 17, 17, 0.04);
        border-bottom:1px solid rgba(17, 17, 17, 0.04);
    }
    .bookingBoxMetaLine {
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
        padding:6px 0px;
    }
    .metaItem {
        font-size:14px;
        font-weight:500;
    }
    .metaValue {
        font-size:14px;
    }
    .bookingTotal {
        margin:24px 12px;
        display:flex;
        flex-direction:row;
    }
    .bookingTotalMeta {
        flex:1;
        display:flex;
        flex-direction:column;
    }
    .bookingTotalItem {
        font-size:18px;
        font-weight:500;
    }
    .bookingTotalSubline {
        color:#717171;
        font-size:12px;
    }
    .bookingTotalValue {
        font-size:18px;
    }
    .reserveWrapper {
        padding:12px;
        display:flex;
        flex-direction:column;
    }
    .reserveButton {
        height:48px;
        color:#FFFFFF;
        font-weight:500;
        border-radius:12px;
        background-color:#2d814e;
        border-width:0px;
    }
    .listingAmenities {
        display:flex;
        flex-direction:column;
    }
`;

export default ReservationBox;