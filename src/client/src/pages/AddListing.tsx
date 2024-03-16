import React from 'react';
import styled from 'styled-components';
import {createListing} from '../features/listing/listingThunk';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {countries} from '../utils';

const AddListing: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {createListingLoading} = useSelector((store: useSelectorType) => store.listing);
    const [amenitiesInput, setAmenitiesInput] = React.useState<string[]>([]);
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
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('name', (target.elements.namedItem('name') as HTMLInputElement).value);
        formData.append('country', (target.elements.namedItem('country') as HTMLInputElement).value);
        formData.append('housingCapacity', (target.elements.namedItem('housingCapacity') as HTMLInputElement).value);
        formData.append('bedrooms', (target.elements.namedItem('bedrooms') as HTMLInputElement).value);
        formData.append('beds', (target.elements.namedItem('beds') as HTMLInputElement).value);
        formData.append('baths', (target.elements.namedItem('baths') as HTMLInputElement).value);
        formData.append('price', (target.elements.namedItem('price') as HTMLInputElement).value);
        formData.append('description', (target.elements.namedItem('description') as HTMLInputElement).value);
        formData.append('maintenanceFee', (target.elements.namedItem('maintenanceFee') as HTMLInputElement).value);
        formData.append('propertyType', (target.elements.namedItem('propertyType') as HTMLInputElement).value);
        formData.append('address', (target.elements.namedItem('address') as HTMLInputElement).value);
        amenitiesInput.map(amenityInput => {
            formData.append('amenities', amenityInput);
        });
        for (let i = 0; i < target.photos.files.length; i++) {
            formData.append('photos', target.photos.files[i]);
        }
        dispatch(createListing(formData));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>Create Listing</h1>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name"/>
                </div>
                <div>
                    <label htmlFor="propertyType">Property Type</label>
                    <select id="propertyType" name="propertyType">
                        <option value="house">House</option>
                        <option value="apartment">Apartment</option>
                        <option value="guesthouse">Guesthouse</option>
                        <option value="hotel">Hotel</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description"></textarea>
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" min="1"/>
                </div>
                <div>
                    <label htmlFor="maintenanceFee">Maintenance Fee</label>
                    <input id="maintenanceFee" type="number" min="1" name="maintenanceFee"/>
                </div>
                <div>
                    <label htmlFor="housingCapacity">Housing Capacity</label>
                    <input id="housingCapacity" type="number" min="1" name="housingCapacity"/>
                </div>
                <div>
                    <label htmlFor="bedrooms">Bedrooms</label>
                    <input id="bedrooms" type="number" min="1" name="bedrooms"/>
                </div>
                <div>
                    <label htmlFor="beds">Beds</label>
                    <input id="beds" type="number" min="1" name="beds"/>
                </div>
                <div>
                    <label htmlFor="baths">Baths</label>
                    <input id="baths" type="number" min="1" name="baths"/>
                </div>
                <div>
                    <label htmlFor="photos">Photos (Max 5)</label>
                    <input id="photos" type="file" multiple onChange={(input) => {
                        if (input.target.files!.length > 5) {
                            input.target.style.outline = '1px solid red';
                            setTimeout(() => {
                                input.target.style.outline = '';
                            }, 2000);
                            input.target.value = '';
                        }
                    }}/>
                </div>
                <div>
                    <label htmlFor="amenities">Amenities (1 Required)<span className="add-btn" onClick={addAmenity}>+</span></label>
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
                                <button onClick={() => removeAmenity(index)}>X</button>
                            </div>
                        );
                    })}
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <select id="country" name="country" required>
                        <option value=""></option>
                        {countries.map((country, index) => {
                            return (
                                <option key={index} value={country}>{country}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input id="address" type="text" name="address"/>
                </div>
                <button type="submit" disabled={createListingLoading}>{createListingLoading ? 'Creating Listing' : 'Create Listing'}</button>
            </form>
        </Wrapper>
    );
}

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        outline: 1px solid black;
        padding: 1rem;
        width: 50%;
        h1 {
            text-align: center;
            border-bottom: 1px solid black;
            margin-bottom: 1rem;
        }
        label {
            display: block;
        }
        input, select, textarea {
            width: 100%;
            padding: 0.25rem;
            margin-bottom: 0.5rem;
        }
        textarea {
            resize: none;
            height: 10rem;
        }
        button {
            margin-top: 0.5rem;
            width: 100%;
            padding: 0.25rem;
        }
        input[type="file"] {
            padding: 0;
        }
        .add-btn {
            user-select: none;
            cursor: pointer;
            background-color: gray;
            outline: 1px solid black;
            padding: 0 0.5rem;
            margin-left: 0.5rem;
        }
        .add-btn:hover, .add-btn:active {
            background-color: white;
        }
        .amenity-input-container {
            margin: 0.5rem 0;
            input {
                width: 75%;
            }
            button {
                width: 25%;
            }
        }
    }
`;

export default AddListing;