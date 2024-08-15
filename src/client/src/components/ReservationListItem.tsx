import styled from 'styled-components';
import moment from 'moment';
import {type ReservationType} from '../features/reservation/reservationSlice';
import {Link} from 'react-router-dom';
import {ImageViewer} from '../components';

interface ReservationListItemProps {
    data: ReservationType
}

const ReservationListItem: React.FunctionComponent<ReservationListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <ImageViewer data={data.listing.photos} viewType='simple' fullWidth={false}/>
            <div className="reservationBody">
                <div className="reservationItemMain">
                    <div className="reservation-title">{data.listing.name}</div>
                    <span className="reservation-subline">{data.listing.address}</span>
                </div>

                <div className="reservationItem">
                    <span>Check in</span>
                    <div>{moment(data!.startDate).utc().format('MMMM Do YYYY')}</div>
                </div> 

                <div className="reservationItem">
                    <span>Check out</span>
                    <div>{moment(data!.endDate).utc().format('MMMM Do YYYY')}</div>
                </div>    

                <div className="reservationAction">
                    <Link to={`/reservation/${data.id}`}>View Details</Link>
                </div>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 20px;
    text-decoration: none;
    border: 1px solid #e7e7e7;
    .reservationBody {
        padding:10px;
        .reservationItemMain {
            padding:10px;
        }
        .reservationItem {
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
        .reservation-title {
            font-size: 18px;
            font-weight: 500;
            color: #111111;
        }
        .reservation-subline {
            font-size: 14px;
            color: #717171;
            margin-top: 4px;
        }
        .reservationAction {
            padding:10px;
            a { 
                height:48px;
                height: 49px;
                font-size:14px;
                color: #FFFFFF;
                font-weight: 500;
                border-width: 0px;
                border-radius: 12px;
                display:flex;
                align-items: center;
                justify-content: center;
                text-decoration:none;
                background-color: #2d814e;
            }
        }
    }
`;

export default ReservationListItem;