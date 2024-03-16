import styled from 'styled-components';
import {nanoid} from 'nanoid';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {countries, languages} from '../utils';

interface ListingSearchBoxProps {
    searchBoxValues: {
        search: string,
        country: string,
        priceMin: string,
        priceMax: string,
        housingAmount: string,
        bedroomsAmount: string,
        bedsAmount: string,
        bathsAmount: string,
        sort: 'oldest' | 'latest' | 'lowest-price' | 'highest-price' | '',
        propertyTypeValue: 'house' | 'apartment' | 'hotel' | 'guesthouse' | '',
        hostLanguage: string
    },
    updateSearchBoxValues: Function,
    resetSearchBoxValues: Function,
    updateSearch: Function,
    _id?: string
}

const ListingSearchBox: React.FunctionComponent<ListingSearchBoxProps> = ({searchBoxValues, updateSearchBoxValues, resetSearchBoxValues, updateSearch, _id}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(updateSearch(_id));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <div>
                <label htmlFor="search">Search</label>
                <input id="search" name="search" type="search" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={searchBoxValues.country} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    {countries.map(country => {
                        return (
                            <option key={nanoid()} value={country}>{country}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="priceMin">Price Minimum</label>
                <input id="priceMin" type="number" min="1" name="priceMin" value={searchBoxValues.priceMin} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="priceMax">Price Maximum</label>
                <input id="priceMax" type="number" min="1" name="priceMax" value={searchBoxValues.priceMax} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="housingAmount">Housing Amount</label>
                <input id="housingAmount" type="number" min="1" name="housingAmount" value={searchBoxValues.housingAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="bedroomsAmount">Bedrooms Amount</label>
                <input id="bedroomsAmount" type="number" min="1" name="bedroomsAmount" value={searchBoxValues.bedroomsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="bedsAmount">Beds Amount</label>
                <input id="bedsAmount" type="number" min="1" name="bedsAmount" value={searchBoxValues.bedsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="bathsAmount">Baths Amount</label>
                <input id="bathsAmount" type="number" min="1" name="bathsAmount" value={searchBoxValues.bathsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="propertyTypeValue">Property Type</label>
                <select id="propertyTypeValue" name="propertyTypeValue" value={searchBoxValues.propertyTypeValue} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="hotel">Hotel</option>
                    <option value="guesthouse">Guest House</option>
                </select>
            </div>
            <div>
                <label htmlFor="hostLanguage">Host Language</label>
                <select id="hostLanguage" name="hostLanguage" value={searchBoxValues.hostLanguage} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    {languages.map(language => {
                        return (
                            <option key={nanoid()} value={language}>{language}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="sort">Sort</label>
                <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="oldest">Oldest</option>
                    <option value="latest">Latest</option>
                    <option value="lowest-price">Lowest Price</option>
                    <option value="highest-price">Highest Price</option>
                </select>
            </div>
            <button type="reset" onClick={() => dispatch(resetSearchBoxValues())}>Reset</button>
            <button type="submit">Submit</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    outline: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: lightgray;
    border-radius: 0.5rem;
    label {
        display: block;
    }
    input, select, button {
        padding: 0.25rem;
        width: 100%;
        margin-bottom: 0.25rem;
    }
`;

export default ListingSearchBox;