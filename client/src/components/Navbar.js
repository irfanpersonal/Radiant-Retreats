import React from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {IoMdAdd, IoIosInformationCircleOutline} from "react-icons/io";
import {FaHome, FaRegUserCircle, FaRegSun, FaHistory, FaSearch} from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {IoExitOutline} from "react-icons/io5";
import {logoutUser} from '../features/user/userThunk';
import {countries} from '../utils';
import {updateSearchValues} from '../features/home/homeSlice';
import {getAllListings} from '../features/home/homeThunk';

const Navbar = () => {
    const [showSearchOptions, setShowSearchOptions] = React.useState(false);
    const toggleShowSearchOptions = () => {
        setShowSearchOptions(currentState => {
            return !currentState;
        });
    }
    const dispatch = useDispatch();
    const {user} = useSelector(store => store.user);
    const {searchValues} = useSelector(store => store.home);
    return (
        <Wrapper>
            <Link to='/'>
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <FaRegSun style={{marginRight: '0.25rem'}}/>
                    <h1>Retreats</h1>
                </div>
            </Link>
            <div style={{border: '1px solid black', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50%', padding: '0.25rem', position: 'relative'}}>
                <input onClick={toggleShowSearchOptions} style={{width: '100%', border: 'none', outline: 'none'}} type="text" name="search" value={searchValues.search} onChange={(event) => dispatch(updateSearchValues({name: event.target.name, value: event.target.value}))}/>
                <FaSearch style={{marginLeft: '0.25rem', cursor: 'pointer'}} onClick={() => {
                    dispatch(getAllListings());
                }}/>
                {showSearchOptions && (
                    <div style={{outline: '1px solid black', position: 'absolute', top: '100%', left: '0', width: '100%', backgroundColor: 'white', padding: '0.25rem', backgroundColor: 'rgb(235, 243, 232)'}}>
                        <h1 style={{textAlign: 'center', borderBottom: '1px solid black'}}>Filter Options</h1>
                        <div>
                            <label htmlFor="country">Countries</label>
                            <select id="country" name="country" value={searchValues.country} onChange={(event) => dispatch(updateSearchValues({name: event.target.name, value: event.target.value}))}>
                                {countries.map(country => {
                                    return (
                                        <option key={country}>{country}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label>Price Range</label>
                            <input type="number" name="priceMin" value={searchValues.priceMin} onChange={(event) => dispatch(updateSearchValues({name: event.target.name, value: event.target.value}))}/> - <input type="number" name="priceMax" value={searchValues.priceMax} onChange={(event) => dispatch(updateSearchValues({name: event.target.name, value: event.target.value}))}/>
                        </div>
                    </div>
                )}
            </div>
            <div style={{display: 'flex'}}>
                <Link title="Home" style={{marginRight: '0.5rem'}} to='/'><div className="user-box"><FaHome/></div></Link>
                <Link title="About" style={{marginRight: '0.5rem'}} to='/about'><div className="user-box"><IoIosInformationCircleOutline/></div></Link>
                {user?.role === 'customer' && (
                    <Link to='/reservations' style={{marginRight: '0.5rem'}} title="Reservations"><div className="user-box"><FaHistory/></div></Link>
                )}
                {user?.role === 'owner' && (
                    <Link title="Add Listing" style={{marginRight: '0.5rem'}} to='/add-listing'><div className="user-box"><IoMdAdd/></div></Link>
                )}
                <Link style={{marginRight: '0.5rem'}} title="Profile" to={user ? '/profile' : '/auth'}><div className="user-box"><FaRegUserCircle/></div></Link>
                {user && (
                    <Link className="logout" title="Logout"><div className="user-box" onClick={() => dispatch(logoutUser())}><IoExitOutline/></div></Link>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.nav`
    padding: 1rem;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid black;
    h1 {
        font-size: 1rem;
        text-transform: uppercase;
    }
    a {
        text-decoration: none;
        color: black;
    }
    a:hover {
        background-color: rgb(242, 241, 235);
        border-radius: 1rem;
    }
    .active {
        border-bottom: 1px solid black;
    }
    .user-box {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid black;
        border-radius: 1rem;
        padding: 0.25rem 1rem;
    }
    .logout:hover {
        background-color: lightcoral;  
    }
    label {
        display: block;
        margin-top: 1rem;
    }
`;

export default Navbar;