import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getProfileData, logoutUser, updateUser} from '../features/user/userThunk';
import {Loading, Modal, ListingList} from '../components';
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
                <div>
                    <div className="user-container">
                        <div>
                            <img className="user-pfp" src={user!.profilePicture || emptyProfilePicture} alt={user!.name}/>
                            <div className="role">Role: {user!.role.toUpperCase()}</div>
                            {(user!.hostRequest && user!.role !== 'admin') ? (
                                <div className="center black underline" onClick={() => toggleModal()}>View Host Request</div>
                            ) : (
                                <>
                                    {user!.role === 'guest' && (
                                        <Link to='/profile/apply-for-host'><div className="center black">Create Host Request</div></Link>
                                    )}
                                </>
                            )}
                            {user!.role === 'admin' && (
                                <Link to='/host-request'><div className="center black flex"><FaLink style={{marginRight: '0.5rem'}}/>Host Requests</div></Link>
                            )}
                        </div>   
                        <div>
                            <p><span>First Name:</span>{isEditing ? <input id="firstName" type="text" name="firstName" defaultValue={user!.firstName} required/> : user!.firstName}</p>
                            <p><span>Last Name:</span>{isEditing ? <input id="lastName" type="text" name="lastName" defaultValue={user!.lastName} required/> : user!.lastName}</p>
                            <p><span>Birthday:</span>{isEditing ? <input id="birthdate" type="date" name="birthdate" defaultValue={moment(user!.birthdate).utc().format('YYYY-MM-DD')} required/> : moment(user!.birthdate).utc().format('MM-DD-YYYY')}</p>
                            <p><span>Email Address:</span>{isEditing ? <input id="email" type="text" name="email" defaultValue={user!.email} required/> : user!.email}</p>
                            <p><span>Country:</span>
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
                                    user!.country
                                )}
                            </p>
                            <p><span>Language:</span>
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
                                    user!.language
                                )}
                            </p>
                            {isEditing && (
                                <p><span>Profile Picture:</span>
                                    <input id="profilePicture" type="file" name="profilePicture"/>
                                </p>
                            )}
                            <p onClick={() => {
                                setIsEditing(currentState => {
                                    return !currentState;
                                });
                            }} className="btn">{isEditing ? 'Cancel' : 'Edit'}</p>
                            {isEditing && (
                                <p onClick={() => {
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
                                }} className="btn">{editProfileLoading ? 'Editing' : 'Edit'}</p>
                            )}
                        </div> 
                    </div>
                </div>
            )}
            <>
                {user!.role === 'host' && (
                    <>
                        {getAllProfileListingsLoading ? (
                            <Loading title='Loading Profile Listings' position='normal' marginTop='1rem'/>
                        ) : (
                            <div style={{marginTop: '1rem'}}>
                                <ListingList data={listings} numberOfPages={numberOfPages as number} page={page as number} totalListings={totalListings as number} changePage={setPage} updateSearch={getAllProfileListings}/>
                            </div>
                        )}
                    </>
                )}
            </>
            <button onClick={() => {
                dispatch(logoutUser());
            }} className="logout-btn">{logoutLoading ? 'Logging Out' : 'Log Out'}</button>
            {showHostRequest && (
                <Modal title="Viewing Host Request" toggleModal={toggleModal}>
                    <div className="host-request-detail">Phone Number: {user!.hostRequest.phoneNumber}</div>
                    <div className="host-request-detail">Government Issued ID:<span onClick={() => download(user!.hostRequest.governmentIssuedID)}>Download</span></div>
                    <div className="host-request-detail">Background Check:<span onClick={() => download(user!.hostRequest.backgroundCheck)}>Download</span></div>
                    <div className="host-request-detail main-detail">Status: {user!.hostRequest.status.charAt(0).toUpperCase() + user!.hostRequest.status.slice(1)}</div>
                </Modal>                      
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

export default Profile;