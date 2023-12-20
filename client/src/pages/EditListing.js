import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {editSingleListing, getSingleListing} from '../features/listing/listingThunk.js';
import {removeAmenity, updateSingleListing} from '../features/listing/listingSlice.js';
import {countries} from '../utils';
import {nanoid} from 'nanoid';
import {FaArrowAltCircleLeft} from "react-icons/fa";

const EditListing = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {isLoadingSingleListing, singleListing, isLoadingEdit} = useSelector(store => store.listing);
    const [deletePhotos, setDeletePhotos] = React.useState([]);
    const addAmenitiesInput = () => {
        const newElementsHTML = `
            <div style="display: flex; margin-top: 1rem;">
                <input class="amenity-input" style="width: 75%;">
                <span style="width: 25%; cursor: pointer; background-color: lightcoral; padding: 0 0.5rem; border: 1px solid black; display: flex; justify-content: center; align-items: center;" onclick="this.parentNode.remove()">X</span>
            </div>
        `;
        document.querySelector('.amenities-box').insertAdjacentHTML('beforeend', newElementsHTML);
    }
    const handleImageClick = (event) => {
        const imageIdentifier = event.target.src.split('/').pop();
        const index = deletePhotos.indexOf(imageIdentifier);
        if (index === -1) {
            setDeletePhotos(currentState => {
                return [...deletePhotos, imageIdentifier];
            });
        } 
        else {
            const newDeletePhotos = [...deletePhotos];
            newDeletePhotos.splice(index, 1);
            setDeletePhotos(currentState => {
                return newDeletePhotos;
            });
        }
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        const amenities = [];
        document.querySelectorAll('.amenity-input').forEach(input => {
            amenities.push(input.value);
        });
        const formData = new FormData();
        formData.append('name', event.target.elements.name.value);
        formData.append('description', event.target.elements.description.value);
        const photoFiles = event.target.elements.photos.files;
        for (let i = 0; i < photoFiles.length; i++) {
            formData.append('photos', photoFiles[i]);
        }
        formData.append('deletePhotos', JSON.stringify(deletePhotos));
        formData.append('address', event.target.elements.address.value);
        formData.append('country', event.target.elements.country.value);
        formData.append('city', event.target.elements.city.value);
        formData.append('rooms', event.target.elements.rooms.value);
        formData.append('bathrooms', event.target.elements.bathrooms.value);
        formData.append('amenities', JSON.stringify(amenities));
        formData.append('rules', event.target.elements.rules.value);
        formData.append('price', event.target.elements.price.value);
        formData.append('maintenanceFee', event.target.elements.maintenanceFee.value);
        dispatch(editSingleListing({listingID: id, formData}));
    }
    React.useEffect(() => {
        dispatch(getSingleListing(id));
    }, []);
    return (
        <div>
            {isLoadingSingleListing ? (
                <h1>Loading Edit Listing Data...</h1>
            ) : (
                <Wrapper>
                    <form onSubmit={handleSubmit}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', color: 'white', padding: '0.5rem'}}>
                            <Link to={`/listing/${id}`} style={{color: 'white'}}><div style={{flex: '0 0 auto', display: 'flex', alignItems: 'center', cursor: 'pointer'}}><FaArrowAltCircleLeft/></div></Link>
                            <div style={{flex: '1', textAlign: 'center'}}>Edit Listing</div>
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input id="name" type="text" name="name" value={singleListing.name} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea style={{resize: 'none', height: '100px', width: '100%', padding: '0.5rem'}} id="description" name="description" value={singleListing.description} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}></textarea>
                        </div>
                        <h3 style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>Current Images</h3>
                        <div style={{backgroundColor: 'lightgray', padding: '0.5rem', marginTop: '1rem'}}>Note: To remove a photo, simply click on it. If it appears dimmed afterward, it indicates that the photo is marked for deletion.</div>
                        {singleListing.photos.map(photo => {
                            return (
                                <div key={nanoid()}>
                                    <img style={{opacity: deletePhotos.includes(photo.split('/').pop()) ? 0.5 : 1, cursor: 'pointer'}} onClick={handleImageClick} src={photo}/>
                                </div>
                            );
                        })}
                        <div className="photos-box">
                            <label htmlFor="photos">Photos</label>
                            <input style={{margin: '0', padding: '0'}} id="photos" type="file" name="photos" multiple/>
                        </div>
                        <div>
                            <label htmlFor="address">Address</label>
                            <input id="address" type="text" name="address" value={singleListing.address} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="country">Country</label>
                            <select id="country" name="country" value={singleListing.country} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}>
                                {countries.map(country => {
                                    return (
                                        <option key={nanoid()}>{country}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input id="city" type="text" name="city" value={singleListing.city} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="rooms">Rooms</label>
                            <input id="rooms" type="number" name="rooms" min="1" value={singleListing.rooms} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="bathrooms">Bathrooms</label>
                            <input id="bathrooms" type="number" name="bathrooms" min="1" value={singleListing.bathrooms} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="amenities">Amenities<span onClick={addAmenitiesInput} style={{marginLeft: '0.5rem', backgroundColor: 'lightgray', padding: '0 0.5rem', cursor: 'pointer', border: '1px solid black'}}>+</span></label>
                        </div>
                        {singleListing.amenities.map(amenity => {
                            return (
                                <div key={nanoid()} style={{display: 'flex', marginTop: '1rem'}}>
                                    <input className="amenity-input" style={{width: '75%'}} defaultValue={amenity}/>
                                    <span style={{width: '25%', cursor: 'pointer', backgroundColor: 'lightcoral', padding: '0 0.5rem', border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={(event) => {
                                        // Remove this amenity from the singleListing.amenities
                                        console.log(event.target.previousElementSibling.value);
                                        dispatch(removeAmenity(event.target.previousElementSibling.value));
                                    }}>X</span>
                                </div>
                            );
                        })}
                        <div className="amenities-box"></div>
                        <div>
                            <label htmlFor="rules">Rules</label>
                            <textarea style={{resize: 'none', height: '100px', width: '100%', padding: '0.5rem'}} id="rules" name="rules" value={singleListing.rules} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}></textarea>
                        </div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input id="price" type="number" name="price" value={singleListing.price} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="maintenanceFee">Maintenance Fee</label>
                            <input id="maintenanceFee" type="number" name="maintenanceFee" value={singleListing.maintenanceFee} onChange={(event) => dispatch(updateSingleListing({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <button style={{marginTop: '1rem'}} disabled={isLoadingEdit}>{isLoadingEdit ? 'EDITING' : 'EDIT'}</button>
                    </form>
                </Wrapper>
            )}
        </div>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 70%;
        border: 1px solid black;
        padding: 1rem;
        background-color: white;
        border-radius: 1rem;
    }
    h1 {
        text-align: center;
        background-color: black;
        color: white;
    }
    label, input {
        display: block;
    }
    input, button, select {
        width: 100%;
        padding: 0.5rem;
    }
    label {
        margin-top: 1rem;
    }
    p {
        margin: 1rem 0;
        text-align: center;
        cursor: pointer;
    }
    .amenities-input {
        margin-top: 1rem;
    }
    img {
        width: 100%;
        height: 200px;
        border: 1px solid black;
        margin-top: 1rem;
    }
    .left-btn {
        background-color: white;
        border-radius: 1rem;
        position: absolute;
        top: 50%;
        left: 5%;
        cursor: pointer;
        font-size: 2rem;
    }
    .right-btn {
        background-color: white;
        border-radius: 1rem;
        position: absolute;
        top: 50%;
        right: 5%;
        cursor: pointer;
        font-size: 2rem;
    }
`;

export default EditListing;