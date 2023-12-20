import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';
import {toggleAuthType} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';

const Auth = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {wantsToRegister, user, isLoading, isLoadingAuth} = useSelector(store => store.user);
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        if (wantsToRegister) {
            formData.append('name', event.target.elements.name.value);
            formData.append('email', event.target.elements.email.value);
            formData.append('password', event.target.elements.password.value);
            formData.append('role', event.target.elements.role.value);
            formData.append('profilePicture', event.target.profilePicture.files[0]);
            dispatch(registerUser(formData));
            return;
        }
        formData.append('email', event.target.elements.email.value);
        formData.append('password', event.target.elements.password.value);
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
                <h1>{wantsToRegister ? 'Register' : 'Login'}</h1>
                {wantsToRegister && (
                    <>
                        <div>
                            <label htmlFor="name">Name *</label>
                            <input id="name" type="text" name="name"/>
                        </div>
                    </>
                )}
                <div>
                    <label htmlFor="email">Email Address *</label>
                    <input id="email" type="email" name="email"/>
                </div>
                <div>
                    <label htmlFor="password">Password *</label>
                    <input id="password" type="password" name="password"/>
                </div>
                {wantsToRegister && (
                    <>
                        <div>
                            <label htmlFor="role">Role</label>
                            <select id="role" name="role">
                                <option value="customer">Customer</option>
                                <option value="owner">Owner</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="profilePicture">Profile Picture</label>
                            <input style={{padding: '0'}} id="profilePicture" type="file" name="profilePicture"/>
                        </div>
                    </>
                )}
                <p onClick={() => dispatch(toggleAuthType())}>{wantsToRegister ? `Have an account?` : `Don't have an account?`}</p>
                <button type="submit" disabled={isLoadingAuth}>{isLoadingAuth ? 'SUBMITTING' : 'SUBMIT'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 50%;
        border: 1px solid black;
        margin: 1rem 0;
        padding: 1rem;
        background-color: white;
        border-radius: 1rem;
    }
    h1 {
        text-align: center;
        background-color: black;
        color: white;
    }
    label, input {
        display: block;
    }
    input, button, select {
        width: 100%;
        padding: 0.5rem;
    }
    label {
        margin-top: 1rem;
    }
    p {
        margin: 1rem 0;
        text-align: center;
        cursor: pointer;
    }
`;

export default Auth;