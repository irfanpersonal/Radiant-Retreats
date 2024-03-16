import React from 'react';
import styled from 'styled-components';
import {Link, NavLink} from 'react-router-dom';
import {FaHotel, FaUser} from "react-icons/fa";
import {useSelector} from 'react-redux';
import {useSelectorType} from '../store';
import {FaBars, FaTimes} from 'react-icons/fa';

const Navbar: React.FunctionComponent = () => {
    const {user} = useSelector((store: useSelectorType) => store.user);
    const [showSideBar, setShowSideBar] = React.useState<boolean>(false);
    return (
        <Wrapper>
            <div>
                <div onClick={() => {
                    setShowSideBar(currentState => {
                        return !currentState;
                    })
                }} className="sidebar-toggle">{!showSideBar && <FaBars/>}</div>
            </div>
            <Link to='/'>
                <div className="center-straight">
                    <FaHotel className="icon"/>
                    <h1>Radiant Retreats</h1>
                </div>
            </Link>
            {user ? (
                <NavLink to='/profile' className="center-straight cell">
                    <FaUser className="icon"/>
                    <div>{user?.name?.split(' ')[0].toUpperCase() || user.firstName.toUpperCase()}</div>
                </NavLink>
            ) : (
                <Link to='/auth'>Register/Login</Link>
            )}
            <div className={`sidebar ${showSideBar && 'active'}`}>
                <div className="sidebar-content" onClick={(event) => {
                    const target = event.target as HTMLAnchorElement;
                    if (target.tagName === 'A') {
                        setShowSideBar(currentState => {
                            return false;
                        });
                    }
                }}>
                    <Link to='/'>Home</Link>
                    <Link to='/listing'>Listings</Link>
                    <Link to='/user'>Search Users</Link>
                    {(user?.role === 'host' || user?.role === 'guest') && (
                        <Link to='/reservation'>My Reservations</Link>
                    )}
                    {(user?.role === 'host') && (
                        <Link to='/add-listing'>Add Listing</Link>
                    )}
                    {(user?.role === 'admin' && (
                        <Link to='/host-request'>Host Requests</Link>
                    ))}
                    {user?.role === 'admin' && (
                        <Link to='/stats'>Stats</Link>
                    )}
                    {(user?.role === 'host') && (
                        <Link to='/earnings'>Earnings</Link>
                    )}
                    {(user?.role === 'admin') && (
                        <Link to='/cash-out'>Cash Outs</Link>
                    )}
                    {user && (
                        <Link to='/profile'>Profile</Link>
                    )}
                </div>
            </div>
            {showSideBar && (
                <div onClick={() => {
                    setShowSideBar(currentState => {
                        return false;
                    });
                }} className="close-btn"><FaTimes/></div>
            )}
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
    .sidebar-toggle {
        cursor: pointer;
    }
    .sidebar-toggle:hover {
        color: gray;
    }
    h1 {
        font-size: 1rem;
        text-transform: uppercase;
    }
    a {
        text-decoration: none;
        color: black;
    }
    a:hover {
        color: gray;
    }
    .active {
        border-bottom: 1px solid black;
    }
    .center-straight {
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
            margin-right: 0.25rem;
        }
    }
    .cell {
        cursor: pointer;
        outline: 1px solid black;
        padding: 0 1rem;
        border-radius: 1rem;
    }
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 12rem;
        background-color: white;
        border-right: 1px solid black;
        transition: transform 0.3s ease-in-out;
        transform: translateX(-100%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .sidebar-content {
            padding: 0.75rem;
            a {
                text-align: center;
                display: block;
                outline: 1px solid black;
                padding: 0.25rem;
                border-radius: 1rem;
                margin-bottom: 1rem;
            }
            a:hover, a:active {
                background-color: black;
                color: white;
            }
        }
    }
    .close-btn {
        cursor: pointer;
        position: fixed;
        z-index: 1100;
        top: 0.7rem;
        left: 12.5rem;
        outline: 1px solid black;
        padding: 0.5rem;
        border-radius: 50%;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .close-btn:active, .close-btn:hover {
        background-color: black;
        color: white;
    }
    .active {
        transform: translateX(0);
    }
`;

export default Navbar;