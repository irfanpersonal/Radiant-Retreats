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
            <div className="filterHead">
                <h1>Filters</h1>
                <div onClick={() => dispatch(resetSearchBoxValues())}>Clear All</div>
            </div>
            <div className="filterBody">
                <div className="comboRow">
                    <div>
                        <label htmlFor="search">Search</label>
                        <input id="search" name="search" type="search" value={searchBoxValues.search} onChange={(event) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }}/>
                    </div>
                </div>

                <div className="comboRow">
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
                </div>
                
                <div className="comboRow">
                    <div>
                        <label htmlFor="priceMin">Price Minimum</label>
                        <input id="priceMin" type="number" min="1" name="priceMin" value={searchBoxValues.priceMin} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                    <div>
                        <label htmlFor="priceMax">Price Maximum</label>
                        <input id="priceMax" type="number" min="1" name="priceMax" value={searchBoxValues.priceMax} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                </div>

                <div className="comboRow">
                    <div>
                        <label htmlFor="housingAmount">Housing Amount</label>
                        <input id="housingAmount" type="number" min="1" name="housingAmount" value={searchBoxValues.housingAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                </div>

                <div className="comboRow">
                    <div>
                        <label htmlFor="bedroomsAmount">Bedrooms</label>
                        <input id="bedroomsAmount" type="number" min="1" name="bedroomsAmount" value={searchBoxValues.bedroomsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                    <div>
                        <label htmlFor="bathsAmount">Bathrooms</label>
                        <input id="bathsAmount" type="number" min="1" name="bathsAmount" value={searchBoxValues.bathsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                </div>

                <div className="comboRow">
                    <div>
                        <label htmlFor="bedsAmount">Beds Amount</label>
                        <input id="bedsAmount" type="number" min="1" name="bedsAmount" value={searchBoxValues.bedsAmount} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                </div>


                <div className="comboRow">
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
                </div>
                <div className="comboRow">
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
                </div>
                
                <div className="comboRow">
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
                </div>
            </div>
            
            
            
            <div className="filterAction">
                <button type="submit">Submit</button>
            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.form`
    position:relative;
    .filterHead {
        display:flex;
        flex-direction:row;
        align-items:center;
        margin:0px 20px;
        padding:20px 0px;
        justify-content: space-between;
        border-bottom:1px solid #e7e7e7;
        h1 {
            font-size:18px;
            font-weight:500;
        }
        div {
            font-size:14px;
            color:#d13b53;
            cursor:pointer;
        }
    }
    .filterBody {
        padding:10px;
    }
    .comboRow {
        display:flex;
    }
    .comboRow div {
        flex:1;
        display:flex;
        flex-direction:column;
        padding:10px;
    }
    label {
        display: block;
        color: #717171;
        font-size: 12px;
        margin-bottom: 10px;
    }
    input, select {
        flex:1;
        width:100%;
        display:flex;
        border-radius:12px;
        padding:13px 15px;
        border:1px solid rgba(17, 17, 17, 0.2);
    }
    .filterAction {
        padding:20px 20px;
        border-top:1px solid #e7e7e7;
    }
    .filterAction button {
        width:100%;
        height: 48px;
        color: #FFFFFF;
        font-weight: 500;
        border-radius: 12px;
        background-color: #2d814e;
        border-width: 0px;
        margin-bottom:0px;
    }
`;

export default ListingSearchBox;