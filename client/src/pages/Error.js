import styled from 'styled-components';
import {Link, useRouteError} from 'react-router-dom';

const Error = () => {
    const error = useRouteError();
    if (error.status === 404) {
        return (
            <Wrapper>
                <h1>404 Page Not Found</h1>
                <p>Oopsies! Looks like you don't know where your going. How about home?</p>
                <Link to={`/`}>Back Home</Link>
            </Wrapper>
        );
    }
    return (
        <Wrapper>
            <h1>Something went wrong, try again later!</h1>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    h1, p, a {
        margin-top: 1rem;
    }
    a {
        background-color: lightcoral;
        padding: 0.5rem 2rem;
        border-radius: 1rem;
        text-decoration: none;
        color: black;
        background-color: white;
    }
    a:hover {
        background-color: black;
        color: white;
    }
`;

export default Error;