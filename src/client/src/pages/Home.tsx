import React from 'react';
import styled from 'styled-components';
import homeImage from '../images/home-image-new.jpeg'
import homeOne from '../images/homeOne.jpeg'
import homeTwo from '../images/homeTwo.jpeg'
import homeThree from '../images/homeThree.jpeg'
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {updateSearchBoxValues} from '../features/listing/listingSlice';
import {countries} from '../utils';
import {useNavigate} from 'react-router-dom';
import {FaUserPlus, FaHome, FaFilter, FaStar} from 'react-icons/fa';
import { FaMagnifyingGlass } from "react-icons/fa6";


const Home: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {searchBoxValues} = useSelector((store: useSelectorType) => store.listing);
    const [showSearch, setShowSearch] = React.useState<boolean>(false);
    return (
        <>
            <Wrapper>
                <div className="section homeHeader">
                    <div className="homeSplash">
                        <div className="inner">
                            <h1>Book Your Next Getaway  <br/> Find Paradise</h1>
                            <div className="search-box">
                                <input type="search" name="country" autoComplete="off" placeholder='Where is your next vacation?' onFocus={() => {
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
                        </div>
                    </div>
                </div>

                <div className="section">
                    <div className="container">
                        <div className="inner mainPadding">
                            <div className="sectionTitle">
                                <h2 className="bigTitle center">Most Coveted Properties in the World</h2>
                                <div className="subline center">Explore our ever-growing portfolio.</div>
                            </div>
                            
                            <div className="displayBox">
                                <div className="displayColumn">
                                    <div className="displayChild one">
                                        <div className="displayContext">
                                            <div>Outdoor <br/> Resorts</div>
                                            <span>4 Properties</span>
                                        </div>
                                    </div>  
                                </div>
                                <div className="displayColumn">
                                    <div className="displayChild two">
                                        <div className="displayContext">
                                            <div>Summer Cottages</div>
                                            <span>2 Properties</span>
                                        </div>
                                    </div>
                                    <div className="displayChild three">
                                        <div className="displayContext">
                                            <div>Rocky Mountains</div>
                                            <span>6 Properties</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          
                <div className="section">
                    <div className="container">
                        <div className="inner mainPadding padTopNone">
                            <div className="sectionTitle">
                                <h2 className="bigTitle">Some of our beloved features.</h2>
                                <div className="subline">Enjoy access to our new online platform.</div>
                            </div>
                            
                            <div className="featureBox">
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
                            </div>
                        </div>
                    </div>
                </div>
                
            </Wrapper>
         
        </>
    );
}

const Wrapper = styled.div`
    .homeHeader {
        padding:30px;
    }
    .homeSplash {
        flex:1;
        display:flex;
        border-radius:20px;
        background-size:cover;
        background-position:center;
        background-image: url(${homeImage});
        position:relative;
        .inner {
            flex:1;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content: center;
            border-radius:20px;
            padding:300px 20px 220px 20px;
            background-color:rgba(0,0,0,0.50);
        }
        h1 {
            font-size:42px;
            font-weight:600;
            color:#FFFFFF;
            text-align:center;
        }
    }
    .search-box {
        width:500px;
        bottom:-36px;
        max-width:90%;
        position:absolute;
        input {
            flex:1;
            width:100%;
            display:flex;
            padding:45px 30px 20px 30px;
            font-size:18px;
            font-weight:500;
            border-radius:20px;
            border-width:0px;
            outline:0px solid;
            box-shadow:0px 3px 6px rgba(0,0,0,0.30);
        }
        .searchSubmit {
            width:50px;
            height:50px;
            display:flex;
            align-items: center;
            justify-content: center;
            background-color:#2d814e;
            border-radius:20px;
            top:20px;
            right:15px;
            position:absolute;
            pointer-events: none;;
        }
        svg {
            color:#FFFFFF;
        }
    }
    .search-box::before{
        font-size:12px;
        color:#2d814e;
        position:absolute;
        margin-left:30px;
        margin-top:20px;
        content:'Enter Destination';
    }
    .sectionTitle {
        padding:30px;
    }
    .center {
        text-align:center;
    }
    .bigTitle {
        font-size:32px;
        font-weight:600;
    }
    .mainPadding {
        padding:80px 0px 60px 0px;
    }
    .padTopNone {
        padding-top:0px;
    }
    .displayBox {
        flex:1;
        padding:15px;
        height:600px;
        display:flex;
        flex-direction:row;
        .displayColumn {
            flex:1;
            display:flex;
            flex-direction:column;
        }
        .displayChild {
            flex:1;
            margin:15px;
            display:flex;
            flex-direction:column;
            justify-content:flex-end;
            background-size:cover;
            background-position:center;
            border-radius:20px;
        }
        .displayChild.one {
            background-image: url(${homeOne});
        }
        .displayChild.two {
            background-image: url(${homeTwo});
        }
        .displayChild.three {
            background-image: url(${homeThree});
        }
        .displayChild .displayContext div {
            color:#FFFFFF;
        }
        .displayChild.one .displayContext div {
            font-size:42px;
            font-weight:600;
        }
        .displayChild.two .displayContext div {
            font-size:32px;
            font-weight:600;
        }
        .displayChild.three .displayContext div {
            font-size:32px;
            font-weight:600;
        }
        .displayChild .displayContext span {
            font-size:14px;
            color:#FFFFFF;
        }
        .displayContext {
            flex:1;
            padding:30px;
            display:flex;
            flex-direction:column;
            justify-content:flex-end;
            background-color:rgba(0,0,0,0.50);
            border-radius:20px;
        }
    }
    .featureBox {
        padding:30px;
        .feature {
            display:flex;
            flex-direction:row;
            align-items:center;
            padding:30px 0px;
            border-bottom:1px solid #e7e7e7;
        }
        svg {
            margin-right:10px;
            margin-bottom:-2px;
        }
    }

    .search-results {
        width:100%;
        padding:10px;
        margin-top:10px;
        position: absolute;
        border-radius:20px;
        background-color:#FFFFFF;
        box-shadow:0px 3px 6px rgba(0,0,0,0.40);
        .country {
            padding:10px;
            font-size:14px;
            cursor:pointer;
        }
        .country:hover, .country:active {
            font-weight:500;
        }
    }
    .nothing-found {
        font-size:14px;
        padding:20px 0px;
        text-align: center;
    }
    @media (max-width:1000px) {
        .homeSplash .inner {
            padding:100px 20px 120px 20px;
            h1 {
                font-size:24px;
            }
        }
        .displayBox {
            display:flex;
            flex-direction:column;
        }
        .search-box input {
            font-size:14px;
        }
        .inner.mainPadding {
            padding-top:40px;
        }
        .inner.padTopNone {
            padding-top:0px;
            padding-bottom:0px;
        }
        .displayBox .displayChild.one .displayContext div , .displayBox .displayChild.two .displayContext div, .displayBox .displayChild.three .displayContext div {
            font-size:24px;
        }
    }
`;
export default Home;