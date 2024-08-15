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
            <div className="userHeader">
                <img src={data!.profilePicture || emptyProfilePicture} alt={data!.firstName}/>
                <div></div>
            </div>
            <div className="userIco">
                <img src={data!.profilePicture || emptyProfilePicture} alt={data!.firstName}/>
            </div>
            <div className="userBody">
                
                <div className="userItem">
                    <span>User Name</span>
                    <div className="user-title">{data!.firstName} {data!.lastName}</div>
                </div>
                
                <div className="userItem">
                    <span>Country</span>
                    <div className="user-title">{data!.country}</div>
                </div>

                <div className="userItem">
                    <span>User Role</span>
                    <div className="user-title">{data!.role.charAt(0).toUpperCase() + data!.role.slice(1)}</div>
                </div>
            </div>
            
            <div className="userAction">
                <Link to={`/user/${data.id}`} onClick={() => {
                    dispatch(resetSingleUser());
                }}>View</Link>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    overflow:hidden;
    border-radius:20px;
    margin-bottom:30px;
    position:relative;
    border:1px solid #e7e7e7;
    .userHeader {
        width:100%;
        height:100px;
        display:flex;
        flex-direction:column;
        position:relative;
        img {
            width:100%;
            height:100%;
            object-fit:cover;
            object-position: center;
        }
        div {
            top:0px;
            left:0px;
            right:0px;
            bottom:0px;
            position:absolute;
            backdrop-filter: blur(6px);
            background-color: rgba(255, 255, 255, 0.30);
        }
    }
    .userIco {
        img {
            left:0px;
            right:0px;
            width:100px;
            height:100px;
            margin:auto;
            display:block;
            margin-top:-50px;
            border-radius:12px;
            position:absolute;
            z-index:1;
        }
    }
    .userBody {
        padding:70px 10px 10px 10px;
        span {
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .userItem {
            padding:10px;
            display:flex;
            flex-direction:column;
            align-items: center;
            justify-content: center;
            div {
                font-size:14px;
            }
        }
    }
    .userAction {
        display:flex;
        align-items: center;
        justify-content: center;
        padding-bottom:30px;
        a {
            height: 48px;
            font-size:14px;
            font-weight: 500;
            color: #717171;
            border-width: 0px;
            border-radius: 12px;
            padding:0px 40px;
            display:flex;
            align-items:center;
            justify-content: center;
            text-decoration:none;
            background-color: #F5F5F4;
            border: 1px solid rgba(17, 17, 17, 0.04);
        }
    }
`;

export default UserListItem;