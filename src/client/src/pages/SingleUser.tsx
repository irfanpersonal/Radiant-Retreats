import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ListingList} from '../components';
import {getSingleUser, getSingleUserListings} from '../features/user/userThunk';
import {useNavigate, useParams} from 'react-router-dom';
import {setPage} from '../features/listing/listingSlice';

const SingleUser: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {getSingleUserLoading, singleUser, user} = useSelector((store: useSelectorType) => store.user);
    const {getSingleUserListingsLoading, listings, totalListings, numberOfPages, page} = useSelector((store: useSelectorType) => store.listing);
    React.useEffect(() => {
        if (!singleUser) {
            if (user!?.id === id || user!?.userID === id) {
                navigate(`/profile`);
                return;
            }
            dispatch(getSingleUser(id!));
        }
        if (singleUser?.role === 'host') {
            dispatch(getSingleUserListings(singleUser!.email));
        }
    }, [singleUser]);
    return (
        <Wrapper>
            {getSingleUserLoading ? (
                <Loading title="Loading Single User" position='normal'/>
            ) : (
                <div>
                    <div className="user-container">
                        <div>
                            <img className="user-pfp" src={singleUser!.profilePicture || emptyProfilePicture} alt={singleUser!.name}/>
                            <div className="role">Role: {singleUser!.role.toUpperCase()}</div>
                        </div>   
                        <div>
                            <p><span>First Name:</span>{singleUser!.firstName}</p>
                            <p><span>Birthday:</span>{moment(singleUser!.birthdate).utc().format('MM-DD-YYYY')}</p>
                            <p><span>Country:</span>{singleUser!.country}</p>
                            <p><span>Language:</span>{singleUser!.language}</p>
                        </div> 
                    </div>
                    {singleUser?.role === 'host' && (
                        <>
                            {getSingleUserListingsLoading ? (
                                <Loading title="Loading Single User Listings" position='normal' marginTop='1rem'/>
                            ) : (
                                <div style={{marginTop: '0.5rem'}}>
                                    <ListingList data={listings} numberOfPages={numberOfPages as number} page={page as number} totalListings={totalListings as number} changePage={setPage} updateSearch={getSingleUserListings} _id={singleUser!.email}/>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .underline {
        cursor: pointer;
        text-decoration: underline;
    }
    .black {
        color: black;
    }
    .center {
        margin-top: 0.5rem;
        width: 10rem;
        text-align: center;
    }
    .role {
        background-color: black;
        color: white;
        width: 10rem;
        text-align: center;
    }
    .user-container {
        display: flex;
        padding-bottom: 1rem;
        border-bottom: 1px solid black;
        p {
            margin-right: 0.25rem;
            margin-bottom: 0.5rem;
            span {
                margin-right: 0.25rem;
            }
            input, select {
                padding: 0 0.25rem;
            }
        }
        .btn {
            display: inline-block;
            margin-right: 0.5rem;
            cursor: pointer;
            margin-top: 0.5rem;
            width: 25%;
            text-align: center;
            padding: 0.25rem;
            outline: 1px solid black;
        }
        .btn:hover, .btn:active {
            background-color: gray;
            color: white;
        }
        .user-pfp {
            width: 10rem;
            height: 10rem;
            margin-right: 1rem;
        }
        a {
            color: black;
        }
    }
    .center-below {
        display: flex;
        flex-direction: column;
    }
    .logout-btn {
        margin-top: 1rem;
        width: 100%;
        padding: 0.25rem;
    }
    .host-request-image {
        outline: 1px solid black;
        display: block;
        margin: 0 auto;
        width: 50%;
        height: 10rem;
    }
    .host-request-detail {
        margin: 0.5rem 0;
        text-align: center;
        span {
            cursor: pointer;
            background-color: gray;
            padding: 0 0.5rem;
            margin-left: 0.5rem;
            outline: 1px solid black;
        }
        span:hover, span:active {
            background-color: white;
        }
    }
    .main-detail {
        background-color: black;
        color: white;
        padding: 0.25rem;
    }
    .flex {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default SingleUser;