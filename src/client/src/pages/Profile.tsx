import React, {useState} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getProfileData, logoutUser, updateUser} from '../features/user/userThunk';
import {Loading, Modal, ListingList} from '../components';
import { ViewType } from '../components/ListingList';
import {countries, languages} from '../utils';
import {saveAs} from 'file-saver'
import {FaLink} from 'react-icons/fa';
import {getAllProfileListings} from '../features/listing/listingThunk';
import {setPage} from '../features/listing/listingSlice';

const Profile: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [showHostRequest, setShowHostRequest] = React.useState(false);
    const {getProfileDataLoading, user, logoutLoading, editProfileLoading} = useSelector((store: useSelectorType) => store.user);
    const {getAllProfileListingsLoading, listings, totalListings, numberOfPages, page, searchBoxValues} = useSelector((store: useSelectorType) => store.listing);
    const [viewType, setViewType] = useState<ViewType>('grid');
    const toggleModal = () => {
        setShowHostRequest(currentState => {
            return !currentState;
        });
    }
    const download = async (location: string) => {
        const lastUnderscoreIndex = location.lastIndexOf('_');
        const fileName = location.slice(lastUnderscoreIndex + 1);
        try {
            const pdfBlob = await fetch(location).then((res) => res.blob());
            saveAs(pdfBlob, fileName);
        } 
        catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

      
    React.useEffect(() => {
        dispatch(getProfileData());
        if (user!.role === 'host') {
            dispatch(getAllProfileListings());
        }
    }, []);
    return (
        <Wrapper>
            {getProfileDataLoading ? (
                <Loading title="Loading Profile Data" position='normal'/>
            ) : (
                <>
                <div className="profileBanner">
                    <img src={user!.profilePicture || emptyProfilePicture} alt={user!.name}/>
                    <div className="blurInner"></div>
                </div>
                <div className="containerMin">
                    <div className="userContainer">
                        <div className="ucLeft">
                            <img src={user!.profilePicture || emptyProfilePicture} alt={user!.name}/>
                            {isEditing && (
                                <div className="changePhoto">
                                    <input id="profilePicture" type="file" name="profilePicture"/>
                                </div>
                            )}
                        </div>   
                        <div className="ucRight">
                            <div className="userItem">
                                <span>First Name:</span>
                                {isEditing ? <input id="firstName" type="text" name="firstName" defaultValue={user!.firstName} required/> : <div>{user!.firstName}</div>}
                            </div>
                            <div className="userItem">
                                <span>Last Name:</span>
                                {isEditing ? <input id="lastName" type="text" name="lastName" defaultValue={user!.lastName} required/> : <div>{user!.lastName}</div>}
                            </div>
                            <div className="userItem">
                                <span>Birthday:</span>
                                {isEditing ? <input id="birthdate" type="date" name="birthdate" defaultValue={moment(user!.birthdate).utc().format('YYYY-MM-DD')} required/> : <div>{moment(user!.birthdate).utc().format('MM-DD-YYYY')}</div>}
                            </div>
                            <div className="userItem">
                                <span>Email Address:</span>
                                {isEditing ? <input id="email" type="text" name="email" defaultValue={user!.email} required/> : <div className="lowercase">{user!.email}</div>}
                            </div>
                            <div className="userItem">
                                <span>Country:</span>
                                {isEditing ? (
                                    <select id="country" name="country" defaultValue={user!.country} required>
                                        <option value=""></option>
                                        {countries.map((country, index) => {
                                            return (
                                                <option key={index} value={country}>{country}</option>
                                            );
                                        })}
                                    </select>
                                ) : (
                                    <div>{user!.country}</div>
                                )}
                            </div>
                            <div className="userItem">
                                <span>Language:</span>
                                {isEditing ? (
                                    <select id="language" name="language" defaultValue={user!.language} required>
                                        <option value=""></option>
                                        {languages.map((language, index) => {
                                            return (
                                                <option key={index + 1} value={language}>{language}</option>
                                            );
                                        })}
                                    </select>
                                ) : (
                                    <div>{user!.language}</div>
                                )}
                            </div>
                            <div className="userItem">
                                <span>Role:</span>
                                <div>{user!.role}</div>
                            </div>
                            <div className="userItem actionHolder">
                                {isEditing && (
                                    <div onClick={() => {
                                        const formData = new FormData();
                                        formData.append('firstName', (document.querySelector('#firstName') as HTMLInputElement).value);
                                        formData.append('lastName', (document.querySelector('#lastName') as HTMLInputElement).value);
                                        formData.append('birthdate', (document.querySelector('#birthdate') as HTMLInputElement).value);
                                        formData.append('email', (document.querySelector('#email') as HTMLInputElement).value);
                                        formData.append('country', (document.querySelector('#country') as HTMLSelectElement).value);
                                        formData.append('language', (document.querySelector('#language') as HTMLSelectElement).value);
                                        if ((document.querySelector('#profilePicture') as HTMLInputElement).files![0]) {
                                            formData.append('profilePicture', (document.querySelector('#profilePicture') as HTMLInputElement).files![0]);
                                        }
                                        dispatch(updateUser(formData));
                                    }} className="userAction">{editProfileLoading ? 'Editing' : 'Submit'}</div>
                                )}
                                <div className={`userAction ${isEditing ? 'Cancel' : 'Edit'}`} onClick={() => {
                                    setIsEditing(currentState => {
                                        return !currentState;
                                    });
                                }}>{isEditing ? 'Cancel' : 'Edit'}</div>
                                {(user!.hostRequest && user!.role !== 'admin') ? (
                                    <div className="userAction alternateColor" onClick={() => toggleModal()}>View Host Request</div>
                                ) : (
                                    <>
                                        {user!.role === 'guest' && (
                                            <Link to='/profile/apply-for-host'><div className="userAction alternateColor">Create Host Request</div></Link>
                                        )}
                                    </>
                                )}
                                {user!.role === 'admin' && (
                                    <Link to='/host-request' className="userAction alternateColor"><div>Host Requests</div></Link>
                                )}
                            </div> 
                        </div> 
                    </div>
                </div>
                </>
            )}
            <>
                {user!.role === 'host' && (
                    <>
                        {getAllProfileListingsLoading ? (
                            <Loading title='Loading Profile Listings' position='normal' marginTop='1rem'/>
                        ) : (
                            <div style={{marginTop: '1rem'}}>
                                <ListingList data={listings} numberOfPages={numberOfPages as number} page={page as number} totalListings={totalListings as number} changePage={setPage} updateSearch={getAllProfileListings} viewType={viewType}
                            setViewType={setViewType}/>
                            </div>
                        )}
                    </>
                )}
            </>
            {showHostRequest && (
                <Modal title="Viewing Host Request" toggleModal={toggleModal}>
                    <div className="contentList">
                        <div className="contentListItem">
                            <span>Phone Number:</span>
                            <div>{user!.hostRequest.phoneNumber}</div>
                        </div>
                        <div className="contentListItem">
                            <span>Government Issued ID:</span>
                            <div className="downloadButton" onClick={() => download(user!.hostRequest.governmentIssuedID)}>Download</div>
                        </div>
                        <div className="contentListItem">
                            <span>Background Check:</span>
                            <div className="downloadButton" onClick={() => download(user!.hostRequest.backgroundCheck)}>Download</div>
                        </div>
                        <div className="contentListItem">
                            <span>Status:</span>
                            <div>{user!.hostRequest.status.charAt(0).toUpperCase() + user!.hostRequest.status.slice(1)}</div>
                        </div>
                    </div>
                </Modal>                      
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .profileBanner {
        width:100%;
        height:200px;
        position:relative;
        img {
            width:100%;
            height:100%;
            object-fit: cover;
            object-position:center;
        }
        div {
            top:0px;
            bottom:0px;
            left:0px;
            right:0px;
            position:absolute;
            backdrop-filter: blur(20px); 
            background-color:rgba(255,255,255,0.30);
        }
    }
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
                text-decoration:none;
                cursor:pointer;
                text-align:center;
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
            a {
                text-decoration:none;
            }
        }
        .hostRequest {
            padding:10px;
            font-size:14px;
            background-color: #F5F5F4;
            border: 1px solid rgba(17, 17, 17, 0.04);
        }
    }
    .contentListItem {
        padding:10px 0px;
        span {
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .downloadButton {
            user-select: none;
            cursor: pointer;
            height:42px;
            width:150px;
            font-size:14px;
            font-weight:500;
            color:#FFFFFF;
            display:flex;
            border-radius:12px;
            margin-top:6px;
            align-items: center;
            justify-content: center;
            background-color:#2d814e;
        }
    }
    @media (max-width:768px) {
        .profileBanner {
            height:140px;
        }
        .userContainer {
            padding-top:30px;
            flex-direction:column;
        }
        .userContainer .ucLeft {
            padding-left:0px;
            text-align:center;
        }
        .userContainer .ucRight {
            padding-left:0px;
            padding:20px;
            border-bottom:1px solid #e7e7e7;
        }
    }
    @media (max-width:768px) {
        .userAction.alternateColor {
            margin-right:0px !important;
        }
    }
`;

export default Profile;