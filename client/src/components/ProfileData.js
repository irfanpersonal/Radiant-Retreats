import React from 'react';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {updateProfileValues} from '../features/profile/profileSlice';
import {useDispatch, useSelector} from 'react-redux';
import {updateUser} from '../features/profile/profileThunk';

const ProfileData = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {profile, editButtonLoading, editProfileValues} = useSelector(store => store.profile);
    const [isEditingProfile, setIsEditingProfile] = React.useState(false);
    const toggleIsEditingProfile = () => {
        setIsEditingProfile(currentState => {
            return !currentState;
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', event.target.elements.name.value);
        formData.append('bio', event.target.elements.bio.value);
        formData.append('email', event.target.elements.email.value);
        formData.append('profilePicture', event.target.profilePicture.files[0]);
        dispatch(updateUser({user: formData, userID: user.userID}));
    }
    return (
        <>
            {isEditingProfile ? (
                <>
                    <form onSubmit={handleSubmit}>
                        <img src={profile.profilePicture || emptyProfilePicture} alt={profile.name}/>
                        <p style={{marginTop: '1rem'}}>Current Profile Picture</p>
                        <div>
                            <label htmlFor="profilePicture">Profile Picture</label>
                            <input style={{padding: '0'}} id="profilePicture" type="file" name="profilePicture"/>
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" value={editProfileValues.name} onChange={(event) => dispatch(updateProfileValues({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="bio">Bio</label>
                            <textarea style={{resize: 'none', height: '100px'}} id="bio" name="bio" value={editProfileValues.bio} onChange={(event) => dispatch(updateProfileValues({name: event.target.name, value: event.target.value}))}></textarea>
                        </div>
                        <div>
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" name="email" value={editProfileValues.email} onChange={(event) => dispatch(updateProfileValues({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <button onClick={toggleIsEditingProfile} className="btn-red" type="button">CANCEL</button>
                        <button style={{marginTop: '1rem'}} type="submit" disabled={editButtonLoading}>{editButtonLoading ? 'EDITING' : 'EDIT'}</button>
                    </form>
                </>
            ) : (
                <>
                    <img src={profile.profilePicture || emptyProfilePicture} alt={profile.name}/>
                    <h1 className="name">{profile.name}</h1>
                    <h2 style={{textAlign: 'center', marginBottom: '1rem', backgroundColor: 'rgb(249, 181, 114)'}}>Role: {profile.role}</h2>
                    <p style={{backgroundColor: 'lightgray', padding: '1rem', border: '1px solid black'}}>{profile.bio || 'No Bio Provided!'}</p>
                    <button onClick={toggleIsEditingProfile}>EDIT</button>
                </>
            )}   
        </>
    );
}

export default ProfileData;