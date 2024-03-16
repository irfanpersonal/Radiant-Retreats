import React from 'react';
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
        <form className="payment-box" onSubmit={handleCreatePaymentIntent}>
            <h1>${((Number(data!.price) / 100))}, <span style={{fontSize: '0.75rem'}}>1 Night</span></h1>
            <div>
                <label htmlFor="startDate">CHECK-IN</label>
                <Flatpickr id="startDate" name="startDate" value={startDate} onChange={(selectedDates) => {
                    setStartDate(currentState => {
                        return String(moment(selectedDates[0]).format('YYYY-MM-DD'));
                    });
                }} placeholder='mm/dd/yyyy' options={{
                    minDate: new Date().toISOString().split('T')[0],
                    disable: bookedDateValues
                }}/>
            </div>
            <div>
                <label htmlFor="endDate">CHECKOUT</label>
                <Flatpickr id="endDate" name="endDate" value={endDate} onChange={(selectedDates) => {
                    setEndDate(currentState => {
                        return String(moment(selectedDates[0]).format('YYYY-MM-DD'));
                    });
                }} placeholder='mm/dd/yyyy' options={{
                    minDate: new Date().toISOString().split('T')[0],
                    disable: bookedDateValues
                }}/>
            </div>
            <div className="payment-info"><div>Days:</div> {moment(endDate).diff(moment(startDate), 'day') + 1 ? moment(endDate).diff(moment(startDate), 'day') + 1 : 'No Days Selected'}</div>
            <div className="payment-info"><div>Maintenance Fee:</div> ${Number(data!.maintenanceFee) / 100}</div>
            {(moment(endDate).diff(moment(startDate), 'day') + 1) ? (
                <div className="payment-info"><div>Total:</div> ${((moment(endDate).diff(moment(startDate), 'day') + 1) * Number(data.price) + Number(data.maintenanceFee)) / 100}</div>
            ) : (   
                null
            )}
            <button type="submit" disabled={createPaymentIntentLoading}>{createPaymentIntentLoading ? 'Reserving' : 'Reserve'}</button>
        </form>
    );
}

export default ReservationBox;