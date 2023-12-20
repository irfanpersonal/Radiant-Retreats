import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {getOwnerSpecificListings, getSingleUser} from '../features/profile/profileThunk';
import {ProfileData, ListingList, PaginationBox} from '../components';
import {setPage} from '../features/profile/profileSlice';

const Profile = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {isLoadingProfile, isLoadingProfileListings, profile, profileListings, page, numberOfPages, totalListings} = useSelector(store => store.profile);
    React.useEffect(() => {
        dispatch(getSingleUser(user.userID));
        dispatch(setPage(1));
    }, []);
    React.useEffect(() => {
        dispatch(getOwnerSpecificListings());
    }, [page]);
    return (
        <Wrapper>
            {isLoadingProfile ? (
                <h1>Loading Profile Data...</h1>
            ) : (
                <ProfileData/>
            )}
            {isLoadingProfileListings ? (
                <h1>Loading Profile Listings Data...</h1>
            ) : (
                <>
                    {profile?.role === 'owner' && (
                        <ListingList data={profileListings} title="My Listings" totalListings={totalListings}/>
                    )}
                </>
            )}
            <PaginationBox numberOfPages={numberOfPages} page={page} setPage={setPage}/>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    background-color: white;
    img {
        width: 150px;
        height: 150px;
        display: block;
        margin: 0 auto;
        border: 1px solid black;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
    .name {
        color: rgb(33, 150, 243); 
        text-align: center;
        margin: 1rem 0;
    }
    p {
        color: rgb(33, 33, 33);
        text-align: center;
        margin-bottom: 1rem;
    }
    button {
        display: block;
        margin: 0 auto;
        width: 100%;
    }
    button {
        border: none;
        background-color: black; 
        border-radius: 0.5rem;
        cursor: pointer;
        color: rgb(255, 255, 255); 
        padding: 0.5rem 1rem;
        transition: background-color 0.3s ease;
    }
    button:hover {
        background-color: gray;
    }
    .btn-red:hover {
        background-color: rgb(255, 105, 105);
    }
    input, textarea {
        display: block;
        margin-bottom: 1rem;
        width: 100%;
        padding: 0.5rem;
    }
`;

export default Profile;