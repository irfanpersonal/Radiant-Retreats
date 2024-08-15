import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ReservationSearchBox, ReservationList} from '../components';
import {setPage, resetSearchBoxValues, updateSearchBoxValues} from '../features/reservation/reservationSlice';
import {getAllUserReservations} from '../features/reservation/reservationThunk';

const Reservation: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {reservations, getAllUserReservationsLoading, totalReservations, numberOfPages, page, searchBoxValues} = useSelector((store: useSelectorType) => store.reservation);
    React.useEffect(() => {
        dispatch(getAllUserReservations());
    }, []);
    return (
        <Wrapper>
            <div className="stacked">
                <div className="twenty">
                    <ReservationSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllUserReservations} searchBoxValues={searchBoxValues}/>
                </div>
                <div className="seventy-five">
                    {getAllUserReservationsLoading ? (
                        <Loading title="Loading User Reservations" position='normal'/>
                    ) : (
                        <ReservationList data={reservations} numberOfPages={numberOfPages as number} page={page as number} totalReservations={totalReservations as number} changePage={setPage} updateSearch={getAllUserReservations}/>
                    )}
                </div>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .stacked {
        display:flex;
        flex-direction:column;
    }
    .container {
        display: flex;
        .twenty {
            width: 20%;
        }
        .seventy-five {
            margin-left: auto;
            width: 75%;
        }
    }
`;

export default Reservation;