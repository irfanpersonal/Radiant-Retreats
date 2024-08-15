import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {RegisterBox} from '../components';
import {toggleAuthType, setAuthValues, resetAuthValue} from '../features/user/userSlice';
import {registerUser, loginUser} from '../features/user/userThunk';
import {useNavigate} from 'react-router-dom';
import authImg from '../images/auth.jpeg';

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
            <div className="mainWrapper">
                <form onSubmit={handleSubmit}>
                    <div className="logo">radiant retreats</div>
                    <div className="title">{wantsToRegister ? 'Register' : 'Login'}</div>
                    {wantsToRegister ? (
                        <RegisterBox/>
                    ) : (
                        <>  <div className="content">
                                <div style={{paddingBottom:'0px'}}>
                                    <label htmlFor="email">Email</label>
                                    <input placeholder="example@gmail.com" id="email" type="email" name="email" value={authValues.email} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                                </div>
                                <div>
                                    <label htmlFor="password">Password</label>
                                    <input placeholder="*******" id="password" type="password" name="password" value={authValues.password} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                                </div>
                            <button disabled={authLoading} type="submit" className="login-btn">{authLoading ? 'Logging In' : 'Log In'}</button>
                            </div>
                        </>
                    )}
                    <div className="auth-type" onClick={() => {
                        dispatch(toggleAuthType());
                        dispatch(resetAuthValue());
                    }}>{wantsToRegister ? `Have an account?` : `Don't have an account?`}</div>
                </form>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display:flex;
    height: 100vh;
    width: 100vw;
    background-size:cover;
    background-position:center;
    background-image: url(${authImg});
    .mainWrapper {
        flex:1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color:rgba(0,0,0,0.40);
        backdrop-filter:blur(30px);
    }
    form {
        width:400px;
        padding:30px;
        border-radius:20px;
        background-color:#FFFFFF;
        .logo {
            font-size: 20px;
            color: #2d814e;
            font-weight: 600;
            text-align:center;
            padding-bottom:25px;
        }
        .title {
            font-size:14px;
            font-weight:500;
            padding:10px 0px;
            margin:0px -30px;
            text-align:center;
            background-color: #F5F5F4;
            border-bottom:1px solid #e7e7e7;
            border: 1px solid rgba(17, 17, 17, 0.04);
        }
        label {
            display: block;
        }
        input, select {
            flex: 1;
            width: 100%;
            display: flex;
            border-radius: 12px;
            padding: 13px 15px;
            border: 1px solid rgba(17, 17, 17, 0.2);
        }
        .content div {
            padding:20px 0px;
        }
        .content label {
            display: block;
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        .test {
            padding-bottom:0px;
        }
        .btn-box {
            display:flex;
            flex-direction:row;
            align-items: center;
        }
        .next-btn , .login-btn , .register-btn {
            width:100%;
            height: 48px;
            font-size: 14px;
            font-weight: 500;
            color: #FFFFFF;
            border-radius: 12px;
            background-color: #2d814e;
            border-width: 0px;
            flex:1;
            display:flex;
            align-items: center;
            justify-content: center;
            cursor:pointer;
        }
        .prev-btn {
            cursor:pointer;
            width:100%;
            height: 48px;
            font-size: 14px;
            font-weight: 500;
            color: #FFFFFF;
            border-radius: 12px;
            background-color: #000000;
            border-width: 0px;
            flex:1;
            display:flex;
            align-items: center;
            justify-content: center;
            margin-right:15px;
        }
        .auth-type {
            cursor:pointer;
            font-size: 14px;
            font-weight: 400;
            color: #717171;
            border-radius: 12px;
            display:flex;
            align-items: center;
            justify-content: center;
            margin-top:30px;
            margin-bottom:0px;
        }
    }
`;

export default Auth;