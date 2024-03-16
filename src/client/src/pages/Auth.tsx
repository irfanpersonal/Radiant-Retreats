import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {RegisterBox} from '../components';
import {toggleAuthType, setAuthValues, resetAuthValue} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';

const Auth: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {wantsToRegister, authLoading, user, authValues} = useSelector((store: useSelectorType) => store.user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('firstName', authValues.firstName);
            formData.append('lastName', authValues.lastName);
            formData.append('birthdate', authValues.birthdate);
            formData.append('email', authValues.email);
            formData.append('password', authValues.password);
            formData.append('country', authValues.country);
            formData.append('language', authValues.language);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', authValues.email);
        formData.append('password', authValues.password);
        dispatch(loginUser(formData));
    }
    React.useEffect(() => {
        if (user) {
            navigate('/'); 
        }
    }, [user]);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="title">{wantsToRegister ? 'Register' : 'Login'}</div>
                {wantsToRegister ? (
                    <RegisterBox/>
                ) : (
                    <>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input id="email" type="email" name="email" value={authValues.email} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" type="password" name="password" value={authValues.password} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                        </div>
                        <button disabled={authLoading} type="submit" className="login-btn">{authLoading ? 'Logging In' : 'Log In'}</button>
                    </>
                )}
                <div className="auth-type" onClick={() => {
                    dispatch(toggleAuthType());
                    dispatch(resetAuthValue());
                }}>{wantsToRegister ? `Have an account?` : `Don't have an account?`}</div>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    form {
        .title {
            text-align: center;
            background-color: black;
            color: white;
            padding: 0.5rem;
            margin-bottom: 1rem;
            border-radius: 1rem;
        }
        width: 50%;
        outline: 1px solid black;
        padding: 1rem;
        border-radius: 1rem;
        background-color: lightgray;
        label {
            display: block;
        }
        input, select {
            width: 100%;
            padding: 0.25rem;
            margin-bottom: 1rem;
        }
        .login-btn {
            width: 100%;
            padding: 0.25rem;
            background-color: white;
            border: none;
            outline: 1px solid black;
            cursor: pointer;
        }
        .auth-type {
            margin-top: 0.5rem;
            text-align: center;
            cursor: pointer;
        }
        .auth-type:hover, .auth-type:active {
            color: gray;
        }
    }
`;

export default Auth;