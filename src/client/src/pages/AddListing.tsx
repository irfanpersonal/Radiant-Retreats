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
        <Wrapper className="containerMin">
            <form onSubmit={handleSubmit}>
                <h1>Create Listing</h1>
                <div className="comboBox">
                    <div>
                        <label htmlFor="name">Name</label>
                        <input id="name" type="text" name="name"/>
                    </div> 
                </div>
                <div className="comboBox">
                    <div>
                        <label htmlFor="propertyType">Property Type</label>
                        <select id="propertyType" name="propertyType">
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
                        <textarea id="description" name="description"></textarea>
                    </div>
                </div>
                <div className="comboBox">
                    <div>
                        <label htmlFor="price">Price</label>
                        <input id="price" type="number" min="1"/>
                    </div>
                    <div>
                        <label htmlFor="maintenanceFee">Maintenance Fee</label>
                        <input id="maintenanceFee" type="number" min="1" name="maintenanceFee"/>
                    </div> 
                </div>
   
                <div className="comboBox">
                    <div>
                        <label htmlFor="bedrooms">Bedrooms</label>
                        <input id="bedrooms" type="number" min="1" name="bedrooms"/>
                    </div>
                    <div>
                        <label htmlFor="housingCapacity">Housing Capacity</label>
                        <input id="housingCapacity" type="number" min="1" name="housingCapacity"/>
                    </div>
                </div>
                <div className="comboBox">
                    <div>
                        <label htmlFor="beds">Beds</label>
                        <input id="beds" type="number" min="1" name="beds"/>
                    </div>
                    <div>
                        <label htmlFor="baths">Baths</label>
                        <input id="baths" type="number" min="1" name="baths"/>
                    </div>
                </div>
            
                <div className="comboBox photosComboBox">
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
                    <div className="holdPhotos" id="holdPhotos"></div>
                </div>
                <div className="comboBox">
                    <div>
                    <label htmlFor="amenities">Amenities (1 Required)<span className="add-btn" onClick={addAmenity}>Add</span></label>
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
                                <button onClick={() => removeAmenity(index)}>Delete</button>
                            </div>
                        );
                    })}
                    </div>
                </div>
         
                <div className="comboBox">
                    <div>
                        <label htmlFor="address">Address</label>
                        <input id="address" type="text" name="address"/>
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
                </div>

                <div className="comboBox">
                    <div className="createListingAction">
                        <button type="submit" disabled={createListingLoading}>{createListingLoading ? 'Creating Listing' : 'Create Listing'}</button>
                    </div>
                </div>
                
            </form>
        </Wrapper>
    );
}

export const Wrapper = styled.div`
    form {
        padding: 12px;
        margin-top:50px;
        margin-bottom:50px;
        border-radius: 20px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
        h1 {
            padding:12px;
            font-size:24px;
            font-weight:500;
        }
    }
    .comboBox {
        display:flex;
        flex-direction:row;
        div {
            flex:1;
            padding:12px;
            display:flex;
            flex-direction:column;
        }
        .amenity-input-container {
            padding:0px;
            margin:10px 0px;
            flex-direction:row;
            button {
                cursor:pointer;
                color:#FFFFFF;
                border-width:0px;
                padding:0px 20px;
                margin-left:20px;
                border-radius:12px;
                background-color:#d13b53;
            }
        }
        label {
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        input , select {
            flex: 1;
            width:100%;
            display: flex;
            font-size: 14px;
            border-width: 0px;
            border-radius: 12px;
            background-color: #FFFFFF;
            padding: 14px 14px 14px 14px;
        }
        textarea {
            flex: 1;
            display: flex;
            font-size: 14px;
            border-width: 0px;
            border-radius: 12px;
            background-color: #FFFFFF;
            padding: 14px 14px 14px 14px;
        }
        .createListingAction {
            flex-direction:row;
            button {
                height: 48px;
                color: #FFFFFF;
                font-weight: 500;
                border-radius: 12px;
                background-color: #2d814e;
                border-width: 0px;
                margin-bottom: 0px;
                cursor:pointer;
                padding:0px 60px;
            }
            .cancelEdit {
                margin-left:20px;
                background-color:#d13b53;
            }
        }
    }
    .holdPhotos img {
        border-radius:12px;
        margin-top:15px;
    }
    .add-btn {
        font-size:10px;
        color:#FFFFFF;
        padding:6px 15px;
        margin-left: 10px;
        border-radius:8px;
        background-color:#000000;
        cursor:pointer;
    }
    @media (max-width:768px) {
        form {
            margin-top:0px;
            margin-bottom:0px;
            border-radius:0px;
        }
    }
`;

export default AddListing;