import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {setAuthValues} from '../features/user/userSlice';
import {countries, languages} from '../utils';
import {nanoid} from 'nanoid';

const RegisterBox: React.FunctionComponent= () => {
    const dispatch = useDispatch<useDispatchType>();
    const [currentStep, setCurrentStep] = React.useState(0);
    const {authLoading} = useSelector((store: useSelectorType) => store.user);
    const {authValues} = useSelector((store: useSelectorType) => store.user);
    const previousStep = () => {
        setCurrentStep(currentState => {
            return currentState - 1;
        });
    }
    const nextStep = () => {
        const currentInput = (((document.querySelector('label') as HTMLLabelElement).nextElementSibling) as HTMLInputElement | HTMLSelectElement);
        if (!currentInput.value) {
            currentInput.style.border = '1px solid red';
            setTimeout(() => {
                currentInput.style.border = ''; 
            }, 2000);
            return;
        }
        setCurrentStep(currentState => {
            const newState = currentState + 1;
            if (newState === 7) {
                return 0;
            }
            return newState;
        });
    }
    return (
        <Wrapper>
            <div className="enrollStatus">
                <div className={'step ' + (currentStep > 0 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 1 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 2 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 3 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 4 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 5 ? 'done' : '')}></div>
                <div className={'step ' + (currentStep > 6 ? 'done' : '')}></div>
            </div>
            <div className="content">
                {currentStep === 0 && (
                    <div>
                        <label className="center" htmlFor="firstName">Please enter your first name</label>
                        <input id="firstName" type="text" name="firstName" value={authValues.firstName} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                )}
                {currentStep === 1 && (
                    <div>
                        <label className="center" htmlFor="lastName">Please enter your last name</label>
                        <input id="lastName" type="text" name="lastName" value={authValues.lastName} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                )}
                {currentStep === 2 && (
                    <div>
                        <label className="center" htmlFor="birthdate">Please enter your birthday</label>
                        <input id="birthdate" type="date" name="birthdate" value={authValues.birthdate} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                )}
                {currentStep === 3 && (
                    <div>
                        <label className="center" htmlFor="email">Please enter your email address</label>
                        <input id="email" type="text" name="email" value={authValues.email} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                )}
                {currentStep === 4 && (
                    <div>
                        <label className="center" htmlFor="password">Please enter a password</label>
                        <input id="password" type="password" name="password" value={authValues.password} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}/>
                    </div>
                )}
                {currentStep === 5 && (
                    <div>
                        <label className="center" htmlFor="country">Please enter what country you are from</label>
                        <select id="country" name="country" value={authValues.country} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}>
                            <option value=""></option>
                            {countries.map(country => {
                                return (
                                    <option key={nanoid()} value={country}>{country}</option>
                                );
                            })}
                        </select>
                    </div>
                )}
                {currentStep === 6 && (
                    <div>
                        <label className="center" htmlFor="language">Please enter what language you speak</label>
                        <select id="language" name="language" value={authValues.language} onChange={(event) => dispatch(setAuthValues({name: event.target.name, value: event.target.value}))}>
                            <option value=""></option>
                            {languages.map(language => {
                                return (
                                    <option key={nanoid()} value={language}>{language}</option>
                                );
                            })}
                        </select>
                    </div>
                )}
            </div>
            <div className="btn-box">
                {currentStep !== 0 && (
                    <div onClick={previousStep} className="prev-btn">Back</div>
                )}
                {currentStep !== 6 ? (
                    <div style={{marginLeft: 'auto'}} onClick={nextStep} className="next-btn">Next</div>
                ) : (
                    <button className="register-btn" type="submit" disabled={authLoading}>{authLoading ? 'Registering' : 'Register'}</button>
                )}
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .enrollStatus {
        display:flex;
        padding-top:30px;
        padding-bottom:5px;
    }
    .step {
        flex:1;
        height:4px;
        display:flex;
        flex-direction:row;
        background-color:#e7e7e7;
        margin:0px 2px;
        border-radius:2px;
    }
    .done {
        background-color:#2d814e;
    }
`;

export default RegisterBox;