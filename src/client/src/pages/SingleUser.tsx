import React, {useState} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ListingList} from '../components';
import { ViewType } from '../components/ListingList';
import {getSingleUser, getSingleUserListings} from '../features/user/userThunk';
import {useNavigate, useParams} from 'react-router-dom';
import {setPage} from '../features/listing/listingSlice';

const SingleUser: React.FunctionComponent = () => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {getSingleUserLoading, singleUser, user} = useSelector((store: useSelectorType) => store.user);
    const {getSingleUserListingsLoading, listings, totalListings, numberOfPages, page} = useSelector((store: useSelectorType) => store.listing);
    const [viewType, setViewType] = useState<ViewType>('grid');
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
            <div className="container">
            {getSingleUserLoading ? (
                <Loading title="Loading Single User" position='normal'/>
            ) : (
                <div className="userContainer">
              

                        <div className="ucLeft">
                            <img src={singleUser!.profilePicture || emptyProfilePicture} alt={singleUser!.name}/>
                        </div> 
 
                        <div className="ucRight">
                            <div className="userItem">
                                <span>First Name:</span>
                                <div>{singleUser!.firstName}</div>
                            </div>
                            <div className="userItem">
                                <span>Birthday:</span>
                                <div>{moment(singleUser!.birthdate).utc().format('MM-DD-YYYY')}</div>
                            </div>
                            <div className="userItem">
                                <span>Country:</span>
                                <div>{singleUser!.country}</div>
                            </div>
                            <div className="userItem">
                                <span>Language:</span>
                                <div>{singleUser!.language}</div>
                            </div>
                            <div className="userItem">
                                <span>Role:</span>
                                <div>{singleUser!.role}</div>
                            </div>
                       
                        </div> 
          
                    
                </div>
            )}
            </div>

            {singleUser?.role === 'host' && (
                <>
                    {getSingleUserListingsLoading ? (
                        <Loading title="Loading Single User Listings" position='normal' marginTop='1rem'/>
                    ) : (
                        <div style={{marginTop: '0.5rem'}}>
                            <ListingList data={listings} numberOfPages={numberOfPages as number} page={page as number} totalListings={totalListings as number} changePage={setPage} updateSearch={getSingleUserListings} _id={singleUser!.email} viewType={viewType}
                    setViewType={setViewType}/>
                        </div>
                    )}
                </>
            )}

        </Wrapper>
    );
}

const Wrapper = styled.div`
    .userContainer {
        display:flex;
        padding-top:50px;
        .ucRight {
            flex:1;
            display:flex;
            flex-direction:column;
            align-items: flex-start;
            padding-left:40px;
        }
        img {
            width:200px;
            height:200px;
            border-radius:20px;
        }
        .changePhoto {
            display:flex;
            flex-direction:column;
            max-width:200px;
            margin-top:10px;
            span {
                font-size:14px;
            }
        }
        .userItem {
            flex:1;
            width:100%;
            padding:10px;
            display:flex;
            flex-direction:column;
            span {
                color: #717171;
                font-size: 12px;
                margin-bottom: 10px;
            }
            div {
                font-size:14px;
                text-transform:capitalize;
            }
            div.lowercase {
                text-transform:lowercase;
            }
            .userAction {
                display:flex;
                height: 49px;
                min-width:160px;
                padding: 0px 40px;
                color: #FFFFFF;
                font-weight: 500;
                border-width: 0px;
                border-radius: 12px;
                align-items: center;
                justify-content: center;
                background-color: #2d814e;
                margin-right:20px;
                cursor:pointer;
            }
            .userAction.Cancel {
                background-color:#d13b53;
            }
            .alternateColor {
                color:#717171;
                background-color: #F5F5F4;
                border: 1px solid rgba(17, 17, 17, 0.04);
            }
            input , select {
                flex: 1;
                width: 100%;
                display: flex;
                border-radius: 12px;
                padding: 13px 15px;
                border: 1px solid rgba(17, 17, 17, 0.2);
            }
        }
        .actionHolder {
            display:flex;
            flex-direction:row;
        }
        .hostRequest {
            padding:10px;
            font-size:14px;
            background-color: #F5F5F4;
            border: 1px solid rgba(17, 17, 17, 0.04);
        }
    }
    @media (max-width:768px) {
        .userContainer {
            padding-top:30px;
        }
    }
`;

export default SingleUser;