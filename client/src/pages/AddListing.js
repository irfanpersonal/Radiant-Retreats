import styled from 'styled-components';
import {countries} from '../utils';
import {createListing} from '../features/listing/listingThunk.js';
import {useDispatch, useSelector} from 'react-redux';

const AddListing = () => {
    const dispatch = useDispatch();
    const {isLoading} = useSelector(store => store.listing);
    const addAmenitiesInput = () => {
        const newElementsHTML = `
            <div style="display: flex; margin-top: 1rem;">
                <input style="width: 75%;">
                <span style="width: 25%; cursor: pointer; background-color: lightcoral; padding: 0 0.5rem; border: 1px solid black; display: flex; justify-content: center; align-items: center;" onclick="this.parentNode.remove()">X</span>
            </div>
        `;
        document.querySelector('.amenities-box').insertAdjacentHTML('beforeend', newElementsHTML);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        const amenityValues = Array.from(document.querySelectorAll('.amenities-box input')).map(inputElement => inputElement.value);
        formData.append('name', event.target.elements.name.value);
        formData.append('description', event.target.elements.description.value);
        const photoFiles = event.target.elements.photos.files;
        for (let i = 0; i < photoFiles.length; i++) {
            formData.append('photos', photoFiles[i]);
        }
        formData.append('address', event.target.elements.address.value);
        formData.append('country', event.target.elements.country.value);
        formData.append('city', event.target.elements.city.value);
        formData.append('rooms', event.target.elements.rooms.value);
        formData.append('bathrooms', event.target.elements.bathrooms.value);
        formData.append('amenities', JSON.stringify(amenityValues));
        formData.append('rules', event.target.elements.rules.value);
        formData.append('price', event.target.elements.price.value);
        formData.append('maintenanceFee', event.target.elements.maintenanceFee.value);
        dispatch(createListing(formData));
    }
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1>Add Listing</h1>
                <div>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" name="name"/>
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea style={{resize: 'none', height: '100px', width: '100%', padding: '0.5rem'}} id="description" name="description"></textarea>
                </div>
                <div className="photos-box">
                    <label htmlFor="photos">Photos</label>
                    <input style={{margin: '0', padding: '0'}} id="photos" type="file" name="photos" multiple/>
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input id="address" type="text" name="address"/>
                </div>
                <div>
                    <label htmlFor="country">Country</label>
                    <select id="country" name="country">
                        {countries.map(country => {
                            return (
                                <option key={country}>{country}</option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input id="city" type="text" name="city"/>
                </div>
                <div>
                    <label htmlFor="rooms">Rooms</label>
                    <input id="rooms" type="number" name="rooms" min="1"/>
                </div>
                <div>
                    <label htmlFor="bathrooms">Bathrooms</label>
                    <input id="bathrooms" type="number" name="bathrooms" min="1"/>
                </div>
                <div className="amenities-box">
                    <label htmlFor="amenities">Amenities<span onClick={addAmenitiesInput} style={{marginLeft: '0.5rem', backgroundColor: 'lightgray', padding: '0 0.5rem', cursor: 'pointer', border: '1px solid black'}}>+</span></label>
                </div>
                <div>
                    <label htmlFor="rules">Rules</label>
                    <textarea style={{resize: 'none', height: '100px', width: '100%', padding: '0.5rem'}} id="rules" name="rules"></textarea>
                </div>
                <div>
                    <label htmlFor="price">Price</label>
                    <input id="price" type="number" name="price"/>
                </div>
                <div>
                    <label htmlFor="maintenanceFee">Maintenance Fee</label>
                    <input id="maintenanceFee" type="number" name="maintenanceFee"/>
                </div>
                <button style={{marginTop: '1rem'}} disabled={isLoading}>{isLoading ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 50%;
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
`;

export default AddListing;