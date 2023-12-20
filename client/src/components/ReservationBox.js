import React from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {createPaymentIntent} from '../features/listing/listingThunk';

const ReservationBox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    const {message, isReservationLoading, singleListing} = useSelector(store => store.listing);
    const {id} = useParams();
    const today = moment().format('YYYY-MM-DD');
    const [startDate, setStartDate] = React.useState(moment().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = React.useState(moment().clone().add(1, 'day').format('YYYY-MM-DD'));
    const totalAmountOfDays = moment(endDate).diff(startDate, 'days');
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };
    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };
    const handleSubmit = (event) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        dispatch(createPaymentIntent({startDate, endDate, listing: id}));
    }
    return (
        <div className="right-side">
            <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>Reservations</h1>
            <label htmlFor="startDate">Start Date</label>
            <input id="startDate" type="date" name="startDate" value={startDate} onChange={handleStartDateChange} min={today}/>
            <label htmlFor="endDate">End Date</label>
            <input id="endDate" type="date" name="endDate" value={endDate} onChange={handleEndDateChange} min={startDate || today}/>
            <p style={{backgroundColor: 'black', textAlign: 'center', color: 'red'}}>{message}</p>
            <h2 style={{textAlign: 'center', backgroundColor: 'green', color: 'white'}}>Price: ${(singleListing.price + singleListing.maintenanceFee) * totalAmountOfDays}</h2>
            <button disabled={isReservationLoading} onClick={handleSubmit}>{isReservationLoading ? 'RESERVING' : 'RESERVE'}</button>
        </div>
    );
}

export default ReservationBox;