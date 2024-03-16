import React from 'react';
import styled from 'styled-components';
import homeImage from '../images/home-image.jpeg'
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateSearchBoxValues} from '../features/listing/listingSlice';
import {countries} from '../utils';
import {useNavigate} from 'react-router-dom';
import {FaUserPlus, FaHome, FaFilter, FaStar} from 'react-icons/fa';

const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {searchBoxValues} = useSelector((store: useSelectorType) => store.listing);
    const [showSearch, setShowSearch] = React.useState<boolean>(false);
    return (
        <>
            <Wrapper>
                <img src={homeImage}/>
                <div className="search-box">
                        <input type="search" name="country" placeholder='Where is your next vacation?' onFocus={() => {
                            setShowSearch(currentState => {
                                return true;
                            });
                        }} onBlur={() => {
                            const theSearchResults = document.querySelector('.search-results') as HTMLDivElement;
                            if (theSearchResults.matches(':active')) {
                                return;
                            }
                            setShowSearch(currentState => {
                                return false;
                            });
                        }} value={searchBoxValues.country} onChange={(event) => {
                            dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}));
                        }}/>
                        {showSearch && (
                            <div className="search-results">
                                {countries.filter(country => country.toLowerCase().includes(searchBoxValues.country.toLowerCase())).slice(0, 3).map(filteredCountry => (
                                    <div onClick={() => {
                                        dispatch(updateSearchBoxValues({name: 'country', value: filteredCountry}));
                                        navigate(`/listing`);
                                    }} className="country" key={filteredCountry}>{filteredCountry}</div>
                                ))}
                                {countries.filter(country => country.toLowerCase().includes(searchBoxValues.country.toLowerCase())).length === 0 && <div className="nothing-found">No Country Found</div>}
                            </div>
                        )}
                </div>
            </Wrapper>
            <FeatureWrapper>
                <div className="feature">
                    <div className="icon">
                        <FaUserPlus/>
                    </div>
                    <p>Signing up and booking a stay is as easy as a few clicks!</p>
                </div>
                <div className="feature">
                    <div className="icon">
                        <FaHome/>
                    </div>
                    <p>Request host access and start sharing your awesome place with others!</p>
                </div>
                <div className="feature">
                    <div className="icon">
                        <FaFilter/>
                    </div>
                    <p>Enjoy a plethora of filtration methods to narrow down exactly what you're looking for.</p>
                </div>
                <div className="feature">
                    <div className="icon">
                        <FaStar/>
                    </div>
                    <p>Write reviews and view others' feedback to ensure you find the perfect place.</p>
                </div>
            </FeatureWrapper>
        </>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img {
        height: 90vh;
        width: 100%;
    }
    .search-box {
        position: absolute;
        width: 80%;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px solid white;
        outline: none;
        background-color: lightgray;
        input {
            width: 100%;
            display: block;
            padding: 0.5rem;
            border: none;
            outline: none;
            width: 100%;
        }
    }
    .search-results {
        width: calc(100% - 2rem);
        margin: 0 auto; 
        border-top: 1px solid black;
        padding: 0.25rem;
        background-color: white;
        position: absolute;
        .country {
            cursor: pointer;
            outline: 1px solid black;
            padding: 0.25rem;
            margin: 0.25rem; 
        }
        .country:hover, .country:active {
            background-color: lightgray;
        }
    }
    .nothing-found {
        text-align: center;
        text-decoration: underline;
    }
`;

const FeatureWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    gap: 1rem;
    .feature {
        display: flex;
        align-items: center;
        background-color: lightgray;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease;
        .icon {
            margin-right: 1rem;
        }
    }
    .feature:hover {
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    }
`;

export default Home;