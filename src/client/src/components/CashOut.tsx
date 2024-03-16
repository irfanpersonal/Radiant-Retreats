import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {createCashOut} from '../features/cashOut/cashOutThunk';

interface CashOutProps {
    balance: number,
    toggleModal: Function
}

const CashOut: React.FunctionComponent<CashOutProps> = ({balance, toggleModal}) => {
    const dispatch = useDispatch<useDispatchType>();
    const {createCashOutLoading} = useSelector((store: useSelectorType) => store.cashOut);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('fullName', (target.elements.namedItem('fullName') as HTMLInputElement).value);
        formData.append('accountNumber', (target.elements.namedItem('accountNumber') as HTMLInputElement).value);
        formData.append('routingNumber', (target.elements.namedItem('routingNumber') as HTMLInputElement).value);
        dispatch(createCashOut(formData));
    }
    return (
        // I was going to integrate stripe but for some reason they don't allow transfers
        // into accounts that aren't connected to some Stripe Account. So that was unfortunate.
        <Wrapper onSubmit={handleSubmit}>
            <div>Please note that you are initiating a Cash Out Request for $<span>{balance}</span></div>
            <p>Be aware that approval of your request and receipt of payment into your account may take up to 30 days.</p>
            <div className="card-info">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" name="fullName" type="text" required/>
            </div>
            <div className="card-info">
                <label htmlFor="accountNumber">Account Number</label>
                <input id="accountNumber" name="caraccountNumberdNumber" type="text" required/>
            </div>
            <div className="card-info">
                <label htmlFor="routingNumber">Routing Number</label>
                <input id="routingNumber" name="routingNumber" type="text" required/>
            </div>
            <button type="submit" disabled={createCashOutLoading}>{createCashOutLoading ? 'Creating Cash Out' : 'Create Cash Out'}</button>
        </Wrapper>  
    );
}

const Wrapper = styled.form`
    span {
        background-color: gray;
        padding: 0 0.25rem;
    }
    p {
        margin-top: 1rem;
    }
    .card-info {
        margin: 0.5rem 0;
        label {
            display: block;
            margin-bottom: 0.25rem;
        }
        input {
            width: 100%;
            padding: 0.25rem;
            outline: none;
            border: none;
        }
        input:focus {
            outline: 1px solid black;
        }
    }
    .card {
        outline: 1px solid black;
        padding: 0.5rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    .error-message {
        text-align: center;
        outline: 1px solid white;
        padding: 0.25rem;
        margin-bottom: 1rem;
        background-color: black;
        color: red;
    }
    .cancel-btn {
        margin-bottom: 0.5rem;
    }
    button {
        width: 100%;
        padding: 0.25rem;
    }
`;

export default CashOut;