import React from 'react';
import styled from 'styled-components';
import {type ListingType} from '../features/listing/listingSlice';
import {Wrapper} from '../pages/AddListing';
import {updateSingleListing} from '../features/listing/listingThunk';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {countries} from '../utils';

interface EditListingProps {
    data: ListingType,
    cancelEdit: any
}

const EditListing: React.FunctionComponent<EditListingProps> = ({data, cancelEdit}) => {
    const {id} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const {updateSingleListingLoading} = useSelector((store: useSelectorType) => store.listing);
    const [selectedForDeletion, setSelectedForDeletion] = React.useState<number[]>([]);
    const [amenitiesInput, setAmenitiesInput] = React.useState<string[]>(Array.isArray(data!.amenities) ? data!.amenities : [data!.amenities]);
    const addAmenity = () => {
        setAmenitiesInput(currentState => {
            return [...currentState, ''];
        });
    }
    const removeAmenity = (index: number) => {
        setAmenitiesInput(currentState => {
            return currentState.slice(0, index).concat(currentState.slice(index + 1));
        });
    }
    const addPhotoForDeletion = (photo: number) => {
        if (selectedForDeletion.includes(photo)) {
            return;
        }
        setSelectedForDeletion(currentState => {
            return [...currentState, photo]
        });
    }
    const removePhotoForDeletion = (photo: number) => {
        setSelectedForDeletion(currentState => {
            const newState = currentState.filter(item => item !== photo);
            return newState;
        });
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('housingCapacity', (target.elements.namedItem('housingCapacity') as HTMLInputElement).value);
        formData.append('bedrooms', (target.elements.namedItem('bedrooms') as HTMLInputElement).value);
        formData.append('beds', (target.elements.namedItem('beds') as HTMLInputElement).value);
        formData.append('baths', (target.elements.namedItem('baths') as HTMLInputElement).value);
        formData.append('price', (target.elements.namedItem('price') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('maintenanceFee', (target.elements.namedItem('maintenanceFee') as HTMLInputElement).value);
        formData.append('propertyType', (target.elements.namedItem('propertyType') as HTMLInputElement).value);
        formData.append('country', (target.elements.namedItem('country') as HTMLInputElement).value);
        formData.append('address', (target.elements.namedItem('address') as HTMLInputElement).value);
        amenitiesInput.map(amenityInput => {
            formData.append('amenities', amenityInput);
        });
        for (let i = 0; i < target.photos.files.length; i++) {
            formData.append('photos', target.photos.files[i]);
        }
        for (let i = 0; i < selectedForDeletion.length; i++) {
            formData.append('deletePhotos', String(selectedForDeletion[i]));
        }
        dispatch(updateSingleListing({listingID: id!, data: formData}));
    }
    return (
        <Wrapper className="containerMin">
            <form onSubmit={handleSubmit}>
                <h1 className="title">Edit Listing</h1>

                <div className="comboBox">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name" defaultValue={data!.name} required/>
                    </div>
                </div>

                <div className="comboBox">
                    <div>
                        <label htmlFor="propertyType">Property Type</label>
                        <select id="propertyType" name="propertyType" defaultValue={data!.propertyType} required>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="guesthouse">Guesthouse</option>
                            <option value="hotel">Hotel</option>
                        </select>
                    </div>
                </div>

                <div className="comboBox">
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" name="description" defaultValue={data!.description} required></textarea>
                    </div>
                </div>
                
                <div className="comboBox">
                    <div>
                        <label htmlFor="price">Price</label>
                        <input id="price" type="number" min="1" defaultValue={Number(data!.price) / 100} required/>
                    </div>
                    <div>
                        <label htmlFor="maintenanceFee">Maintenance Fee</label>
                        <input id="maintenanceFee" type="number" min="1" name="maintenanceFee" defaultValue={Number(data!.maintenanceFee) / 100} required/>
                    </div>
                </div>
                
            
              
                <div className="comboBox">
                    <div>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input id="bedrooms" type="number" min="1" name="bedrooms" defaultValue={data!.bedrooms} required/>
                    </div>
                    <div>
                        <label htmlFor="housingCapacity">Housing Capacity</label>
                        <input id="housingCapacity" type="number" min="1" name="housingCapacity" defaultValue={data!.housingCapacity} required/>
                    </div>
                </div>

                <div className="comboBox">
                    <div>
                        <label htmlFor="beds">Beds</label>
                        <input id="beds" type="number" min="1" name="beds" defaultValue={data!.beds} required/>
                    </div>
                    <div>
                        <label htmlFor="baths">Baths</label>
                        <input id="baths" type="number" min="1" name="baths" defaultValue={data!.baths} required/>
                    </div>
                </div>

                <div className="comboBox holdPhotos">
                    <div>
                        <label htmlFor="photos">Photos (Max {5 - (data.photos.length - selectedForDeletion.length)})</label>
                        <input id="photos" type="file" multiple onChange={(input) => {
                            if (input.target.files!.length > (5 - (data.photos.length - selectedForDeletion.length))) {
                                input.target.style.outline = '1px solid red';
                                setTimeout(() => {
                                    input.target.style.outline = '';
                                }, 2000);
                                input.target.value = '';
                            }
                        }}/>
                        {data.photos.map((photo: string, index: number) => {
                            return (
                                <img className={`${selectedForDeletion.includes(index) && 'selected'}`} onClick={() => {
                                    if (selectedForDeletion.includes(index)) {
                                        removePhotoForDeletion(index);
                                        return;
                                    }
                                    addPhotoForDeletion(index);
                                }} key={index} style={{
                                    width: '5rem',
                                    height: '5rem',
                                    cursor: 'pointer',
                                    marginRight: '0.5rem'
                                }} src={photo}/>
                            );
                        })}
                    </div>
                </div>
                
                
                <div className="comboBox">
                    <div>
                        <label style={{marginTop: '0.25rem'}} htmlFor="amenities">Amenities (1 Required)<span className="add-btn" onClick={addAmenity}>Add</span></label>
                        {amenitiesInput.map((amenityInput: string, index: number) => {
                            return (
                                <div key={index} className="amenity-input-container">
                                    <input id="amenities" type="text" value={amenityInput} onChange={(event) => {
                                        const newAmenitiesInput = [...amenitiesInput]; 
                                        newAmenitiesInput[index] = event.target.value; 
                                        setAmenitiesInput(currentState => {
                                            return newAmenitiesInput;
                                        }); 
                                    }}/>
                                    <button type="button" onClick={() => {
                                        if (amenitiesInput.length === 1) {
                                            return;
                                        }
                                        removeAmenity(index);
                                    }}>Delete</button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="comboBox">
                    <div>
                        <label htmlFor="address">Address</label>
                        <input id="address" type="text" name="address" defaultValue={data!.address} required/>
                    </div>
                    <div>
                        <label htmlFor="country">Country</label>
                        <select id="country" name="country" defaultValue={data!.country} required>
                            <option value=""></option>
                            {countries.map((country, index) => {
                                return (
                                    <option key={index} value={country}>{country}</option>
                                );
                            })}
                        </select>
                    </div>
                </div>
            
                <div className="comboBox">
                    <div className="createListingAction">
                        <button type="submit" disabled={updateSingleListingLoading}>{updateSingleListingLoading ? 'Editing' : 'Submit'}</button>
                        <button className="cancelEdit" type="button" onClick={cancelEdit}>Cancel</button>
                    </div>
                </div>
                
            </form>
        </Wrapper>
    );
}

export default EditListing;