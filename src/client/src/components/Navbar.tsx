import React from 'react';
import styled from 'styled-components';
import {Link, NavLink} from 'react-router-dom';
import {FaHotel, FaUser} from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux';
import {FaBars, FaTimes} from 'react-icons/fa';
import {getProfileData, logoutUser} from '../features/user/userThunk';
import {type useDispatchType, type useSelectorType} from '../store';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';

const Navbar: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const [showSideBar, setShowSideBar] = React.useState<boolean>(false);
    const toggleMenu = () => {
        document.querySelector('.extendedMenu')?.classList.toggle('active');
    };
    return (
        <Wrapper>
            <div className="menuBar">
                <div className="logoCombo">
                    <div className="mobileToggle" onClick={toggleMenu}>
                        <div className="mtDecor one"></div>
                        <div className="mtDecor two"></div>
                        <div className="mtDecor three"></div>
                    </div>
                    <Link to='/'> <div className="logo"><span>radiant</span> retreats</div></Link>
                </div>
                <div className="menu">
                    <NavLink to='/'>Home</NavLink>
                    <NavLink to='/listing'>Listings</NavLink>
                    <NavLink to='/user'><span>Search&nbsp;</span> Users</NavLink>
                    {(user?.role === 'host' || user?.role === 'guest') && (
                        <NavLink to='/reservation'><span>My&nbsp;</span> Reservations</NavLink>
                    )}
                    {(user?.role === 'host') && (
                        <NavLink to='/add-listing'><span>Add&nbsp;</span>Listing</NavLink>
                    )}
                    {(user?.role === 'admin' && (
                        <NavLink to='/host-request'><span>Host&nbsp;</span> Requests</NavLink>
                    ))}
                    {user?.role === 'admin' && (
                        <NavLink to='/stats'>Stats</NavLink>
                    )}
                    {(user?.role === 'host') && (
                        <NavLink to='/earnings'>Earnings</NavLink>
                    )}
                    {(user?.role === 'admin') && (
                        <NavLink to='/cash-out'>Cash Outs</NavLink>
                    )}
                    {user && (
                        <NavLink to='/profile'>Profile</NavLink>
                    )}
                </div>
                {user ? (
                    <Link to='/profile' className="accountLink">
                        {/* <FaUser className="icon"/> */}
                        <div className="avatar">
                            <img src={user!.profilePicture || emptyProfilePicture} alt={user!.name}/>
                        </div>
                        <span className="userLabel">{user?.name?.split(' ')[0] || user.firstName}</span>
                        <div className="displayNone logoutWrapper" onClick={() => { 
                            dispatch(logoutUser());
                            window.location.reload()
                        }}>
                            <div>Logout</div>
                        </div>
                    </Link>
                ) : (
                    <Link to='/auth' className="accountLink">
                        <div className="avatar">?</div>
                        <span>Register/Login</span>
                    </Link>
                )}
            </div>
            <div className="extendedMenu">
                <div className="menu">
                    <NavLink onClick={toggleMenu} to='/'>Home</NavLink>
                    <NavLink onClick={toggleMenu} to='/listing'>Listings</NavLink>
                    <NavLink onClick={toggleMenu} to='/user'>Search Users</NavLink>
                    {(user?.role === 'host' || user?.role === 'guest') && (
                        <NavLink onClick={toggleMenu} to='/reservation'>My Reservations</NavLink>
                    )}
                    {(user?.role === 'host') && (
                        <NavLink onClick={toggleMenu} to='/add-listing'>Add Listing</NavLink>
                    )}
                    {(user?.role === 'admin' && (
                        <NavLink onClick={toggleMenu} to='/host-request'>Host Requests</NavLink>
                    ))}
                    {user?.role === 'admin' && (
                        <NavLink onClick={toggleMenu} to='/stats'>Stats</NavLink>
                    )}
                    {(user?.role === 'host') && (
                        <NavLink onClick={toggleMenu} to='/earnings'>Earnings</NavLink>
                    )}
                    {(user?.role === 'admin') && (
                        <NavLink onClick={toggleMenu} to='/cash-out'>Cash Outs</NavLink>
                    )}
                    {user && (
                        <NavLink onClick={toggleMenu} to='/profile'>Profile</NavLink>
                    )}
                </div>
            </div>
            <div className="displayNone">
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
    .menuBar {
        display:flex;
        flex-direction:row;
        align-items:center;
        padding:0px 30px;
        justify-content:space-between;
        border-bottom:1px solid #e7e7e7;
    }
    .logoCombo {
        display:flex;
        flex-direction:row;
        align-items: center;
    }
    .mobileToggle {
        display:flex;
        display:none;
        flex-direction:column;
        .mtDecor {
            width:25px;
            height:3px;
            border-radius:2px;
            margin-right:20px;
            background-color:#2d814e;
        }
        .mtDecor.two {
            margin:6px 0px;
        }
    }
    
    .logo {
        font-size:20px;
        color:#2d814e;
        font-weight:600;
        padding:20px 0px;
    }
    .menu {
        display:flex;
    }
    .menu a {
        display:flex;
        font-size:14px;
        color:#717171;
        margin:0px 20px;
        padding: 22px 0px;
        border-top: 3px solid transparent;
        border-bottom: 3px solid transparent;
    }
    .menu a.active {
        color:#000000;
        font-weight:500;
        border-bottom-color:#2d814e;
    }
    .extendedMenu {
        display:none;
        border-bottom:1px solid #e7e7e7;
        .menu {
            flex:1;
            display:flex;
        }
        a {
            flex:1;
            margin:0px;
            display:flex;
            white-space:nowrap;
            align-items: center;
            justify-content: center;
        }
    }
    .accountLink {
        display:flex;
        flex-direction:row-reverse;
        align-items:center;
        position:relative;
        .avatar {
            width:45px;
            height:45px;
            font-size:14px;
            color:#bdbdbd;
            font-family:'Arial';
            margin-left:15px;
            display:flex;
            align-items:center;
            justify-content: center;
            border-radius:999px;
            background-color: #F5F5F4;
            border: 1px solid rgba(17, 17, 17, 0.04);
            img {
                width:45px;
                height:45px;
                border-radius:999px;
            }
        }
        span {
            font-size:14px;
        }
    }
    .userLabel {
        text-transform: capitalize;
    }

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
    .logoutWrapper {
        left:0px;
        right:0px;
        z-index:9;
        opacity:0;
        position:absolute;
        border-radius:8px;
        display:flex !important;
    }
    .accountLink:hover .logoutWrapper {
        opacity:1;
        div {
            flex:1;
            display:flex;
            font-size:14px;
            color:#000000;
            padding: 12px 5px;
            border-radius:8px;
            text-align:center;
            align-items: center;
            justify-content: center;
            background-color:#FFFFFF;
            border:0px solid #e7e7e7;
            box-shadow:0px 1px 2px rgba(0,0,0,0.30);
        }
    }
    @media (min-width:1000px) and (max-width:1100px) {
        .menu span {display:none;}
    }
    @media (min-width:768px) and (max-width:1000px) {
        .menu {display:none;}
        .extendedMenu , .extendedMenu .menu {
            display:flex;
        }
    }
    @media (max-width:768px) {
        .menu {display:none;}
        .mobileToggle {display:flex;}
        .extendedMenu.active {
            left:0px;
            right:0px;
            z-index:999;
            display:flex;
            position:absolute;
            flex-direction:column;
            background-color:#FFFFFF;
            box-shadow:0px 3px 6px rgba(0,0,0,0.30);
        }
        .extendedMenu.active .menu {
            flex-direction:column;
        }
    }
    @media (max-width:490px) {
        .logo span {display:none;}
    }
`;

export default Navbar;