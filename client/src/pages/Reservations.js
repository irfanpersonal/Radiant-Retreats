import React from 'react';
import {getAllReservations} from '../features/reservations/reservationsThunk';
import {useDispatch, useSelector} from 'react-redux';
import {ReservationList} from '../components';

const Reservations = () => {
    const dispatch = useDispatch();
    const {isLoading, reservations} = useSelector(store => store.reservations);
    React.useEffect(() => {
        dispatch(getAllReservations());
    }, []);
    return (
        <div>
            {isLoading ? (
                <h1>Loading All Reservations....</h1>
            ) : (
                <ReservationList title="My Reservations" data={reservations}/>
            )}
        </div>
    );
}

export default Reservations;