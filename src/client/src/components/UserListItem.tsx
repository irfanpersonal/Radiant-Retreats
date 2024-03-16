import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {resetSingleUser, type UserType} from '../features/user/userSlice';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';

interface UserListItemProps {
    data: UserType
}

const UserListItem: React.FunctionComponent<UserListItemProps> = ({data}) => {
    const dispatch = useDispatch<useDispatchType>();
    return (
        <Wrapper>
            <div className="user-title">{data!.firstName} {data!.lastName}</div>
            <img className="user-img" src={data!.profilePicture || emptyProfilePicture} alt={data!.firstName}/>
            <div className="user-detail">{data!.country}</div>
            <div className="user-detail">{data!.role.charAt(0).toUpperCase() + data!.role.slice(1)}</div>
            <Link to={`/user/${data.id}`} onClick={() => {
                dispatch(resetSingleUser());
            }}>View More</Link>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    outline: 1px solid black;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
    .user-title {
        border-bottom: 1px solid black;
    }
    .user-img {
        width: 5rem;
        height: 5rem;
        margin-top: 0.5rem;
        outline: 1px solid black;
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
    .user-detail {
        margin: 0.25rem 0;
    }
`;

export default UserListItem;