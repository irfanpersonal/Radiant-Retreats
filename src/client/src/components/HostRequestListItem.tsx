import styled from 'styled-components';
import moment from 'moment';
import {type HostRequest} from '../features/hostRequest/hostRequestSlice';
import {Link} from 'react-router-dom';
import {capitalizeFirstLetter} from '../utils';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';

interface HostRequestListItemProps {
    data: HostRequest
}

const HostRequestListItem: React.FunctionComponent<HostRequestListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <img className="userIco" src={data!.user.profilePicture || emptyProfilePicture} alt={data!.user.firstName}/>

            <div className="hrList">
                <div className="hrItem">
                    <span>Name:</span>
                    <div>{capitalizeFirstLetter(data.user.firstName)} {capitalizeFirstLetter(data.user.lastName)}</div>
                </div>
                <div className="hrItem">
                    <span>Country:</span>
                    <div>{data.user.country}</div>
                </div>
                <div className="hrItem">
                    <span>Status:</span>
                    <div>{capitalizeFirstLetter(data.status)}</div>
                </div>
                <div className="hrItem">
                    <span>Created:</span>
                    <div>{moment(data.createdAt).format('MMMM Do YYYY')}</div>
                </div>
                <div className="hrItem">
                    <Link to={data.id}>View</Link>
                </div>
            </div>
            
            
        </Wrapper>
    );
}

const Wrapper = styled.article`
    overflow:hidden;
    border-radius:20px;
    margin-bottom:30px;
    position:relative;
    border:1px solid #e7e7e7;
    .userIco {
        width:100px;
        height:100px;
        border-radius:12px;
        margin-top:20px;
        margin-left:20px;
    }
    .hrList {
        padding:10px;
        .hrItem {
            padding:10px;
            span {
                color: #717171;
                font-size: 12px;
                margin-bottom: 10px;
            }
            div {
                font-size:14px;
            }
            a { 
                display:flex;
                height: 48px;
                font-size:14px;
                color: #FFFFFF;
                font-weight: 500;
                border-radius: 12px;
                text-decoration:none;
                background-color: #2d814e;
                border-width: 0px;
                align-items:center;
                justify-content: center;
            }
        }
    }
`;

export default HostRequestListItem;