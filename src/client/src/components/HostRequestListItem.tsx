import styled from 'styled-components';
import moment from 'moment';
import {type HostRequest} from '../features/hostRequest/hostRequestSlice';
import {Link} from 'react-router-dom';
import {capitalizeFirstLetter} from '../utils';

interface HostRequestListItemProps {
    data: HostRequest
}

const HostRequestListItem: React.FunctionComponent<HostRequestListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <div>Name: {capitalizeFirstLetter(data.user.firstName)} {capitalizeFirstLetter(data.user.lastName)}</div>
            <div>Country: {data.user.country}</div>
            <div>Status: {capitalizeFirstLetter(data.status)}</div>
            <div>Created At: {moment(data.createdAt).format('MMMM Do YYYY')}</div>
            <Link to={data.id}>View</Link>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    margin-top: 1rem;
    padding: 1rem;
    text-align: center;
    div {
        margin: 0.5rem 0;
    }
    a {
        padding: 0.25rem;
        display: block;
        text-align: center;
        color: black;
        text-decoration: none;
        background-color: gray;
    }
    a:hover, a:active {
        outline: 1px solid black;
        background-color: white;
    }
`;

export default HostRequestListItem;