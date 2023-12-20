import styled from 'styled-components';
import housesImage from '../images/houses.jpg';
import {Link} from 'react-router-dom';

const Landing = () => {
    return (
        <Wrapper>
            <h1>Radiant Retreats</h1>
            <img src={housesImage} alt="A bunch of beautiful houses!"/><br/>
            <h1>Your perfect getaway starts here</h1>
            <Link to='/'>Get Started</Link>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    text-align: center;
    h1, img, a {
        margin-top: 1rem;
    }
    img {
        width: 250px;
        height: 250px;
        border: 0.5rem solid white;
        border-radius: 50%;
    }
    a {
        outline: 1px solid black;
        text-decoration: none;
        border-radius: 1rem;
        color: black;
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: lightcoral;
    }
    a:hover {
        background-color: lightblue;
    }
`;

export default Landing;