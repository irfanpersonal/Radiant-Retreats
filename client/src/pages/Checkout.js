import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {createReservation} from '../features/listing/listingThunk';
import {setSuccessfulOrder} from '../features/listing/listingSlice';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store => store.user);
    const {createReservationData} = useSelector(store => store.listing);
    const [message, setMessage] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async(event) => {
        event.preventDefault();
        setLoading(currentState => {
            return true;
        });
        if (!stripe || !elements) {
            return;
        }
        const result = await stripe.confirmCardPayment(createReservationData.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });
        if (result.error) {
            setLoading(currentState => {
                return false;
            });
            setMessage(currentState => {
                return result.error.message;
            });
        }
        else {
            setLoading(currentState => {
                return false;
            });
            navigate('/success');
            dispatch(setSuccessfulOrder(true));
            dispatch(createReservation({startDate: createReservationData.startDate, endDate: createReservationData.endDate, listing: createReservationData.listing, user: createReservationData.user, clientSecret: createReservationData.clientSecret}));
        }
    }
    React.useEffect(() => {
        if (!createReservationData) {
            navigate('/');
        }
    }, []);
    return (
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <h1 style={{backgroundColor: 'black', color: 'white', textAlign: 'center', marginBottom: '1rem'}}>Checkout</h1>
                <h1 style={{borderBottom: '1px solid black', marginBottom: '1rem'}}>Hey, {user.name}</h1>
                <p>You are about to make a reservation at <span>{createReservationData?.listingDetails?.name}</span></p>
                <p>Stay dates: <span>{createReservationData?.startDate}</span> to <span>{createReservationData?.endDate}</span></p>
                <p>Total cost: <span>${createReservationData?.total / 100}</span></p>
                {/* <p>You are purchasing a reservation from "{createReservationData?.startDate}" to "{createReservationData?.endDate}" at the "{createReservationData?.listingDetails?.name}". For a total cost of ${createReservationData?.total / 100}.</p> */}
                <CardElement className="card"/>
                {message && (
                    <p style={{backgroundColor: 'lightgray', padding: '0.5rem', marginTop: '1rem'}}>{message}</p>
                )}
                <button type="submit" disabled={!stripe || loading}>{loading ? 'PAYING' : 'PAY'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        background-color: white;
        width: 50%;
        border: 1px solid black;
        padding: 1rem;
    }
    button {
        margin-top: 1rem;
        padding: 0.5rem;
        width: 100%;
    }
    p {
        margin-top: 1rem;
    }
    span {
        background-color: lightgray;
    }
    .card {
        display: block;
        padding: 1rem;
        margin: 1rem 0;
        font-size: 1rem;
        border: 1px solid rgb(204, 204, 204);
        border-radius: 0.25rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        background-color: white;
    }
`;

export default Checkout;