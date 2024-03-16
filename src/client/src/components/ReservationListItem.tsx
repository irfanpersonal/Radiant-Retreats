import styled from 'styled-components';
import moment from 'moment';
import {type ReservationType} from '../features/reservation/reservationSlice';
import {Link} from 'react-router-dom';

interface ReservationListItemProps {
    data: ReservationType
}

const ReservationListItem: React.FunctionComponent<ReservationListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <div className="reservation-title">{data.listing.name}</div>
            <div>{data.listing.address}</div>
            <div>{moment(data!.startDate).utc().format('MMMM Do YYYY')}</div>    
            <div>{moment(data!.endDate).utc().format('MMMM Do YYYY')}</div>    
            <Link to={`/reservation/${data.id}`}>View More</Link>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    outline: 1px solid black;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    div {
        margin-bottom: 0.25rem;
    }
    .reservation-title {
        border-bottom: 1px solid black;
    }
    a {
        display: block;
        color: black;
        text-decoration: none;
        background-color: lightgray;
        width: 100%;
    }
    a:hover, a:active {
        outline: 1px solid black;
    }
`;

export default ReservationListItem;