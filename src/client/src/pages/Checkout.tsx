import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {useNavigate} from 'react-router-dom';
import {ImageViewer} from '../components';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {toast} from 'react-toastify';
import {resetPurchaseData, setCreateReservationLoading} from '../features/reservation/reservationSlice';
import {createReservation} from '../features/reservation/reservationThunk';

const Checkout: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {paymentIntentData, createReservationLoading, successfullyPayed} = useSelector((store: useSelectorType) => store.reservation); 
    const handleSubmit = async(event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        dispatch(setCreateReservationLoading(true));
        const result = await stripe.confirmCardPayment(paymentIntentData!.clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)!
            }
        });
        if (result.error) {
            dispatch(setCreateReservationLoading(false));
            toast.error('Please enter all the information in correctly!');
        }
        else {
            dispatch(createReservation({listingID: paymentIntentData!.listing.id, clientSecret: paymentIntentData!.clientSecret, startDate: paymentIntentData!.startDate, endDate: paymentIntentData!.endDate, total: paymentIntentData!.total}));
        }
    }
    const stripe = useStripe();
    const elements = useElements();
    React.useEffect(() => {
        if (!paymentIntentData) {
            navigate('/');
        }
    }, []);
    React.useEffect(() => {
        if (successfullyPayed) {
            navigate('/success');
        }
    }, [successfullyPayed]);
    return (
        <Wrapper>
            {paymentIntentData && (
                <form onSubmit={handleSubmit}>
                    <h1 className="title">Checkout</h1>
                    <div className="images">
                        <ImageViewer data={paymentIntentData!.listing.photos} fullWidth={false} viewType='advanced'/>
                    </div>
                    <p className="checkout-detail">You are about to make a reservation at <span className="important-info">{paymentIntentData!.listing.name}</span>. This action cannot be undone so please make sure that you are happy with your timings.</p>
                    <div className="checkout-detail">Start Date: <span className="important-info">{paymentIntentData!.startDate}</span></div>
                    <div className="checkout-detail">End Date: <span className="important-info">{paymentIntentData!.endDate}</span></div>
                    <div className="checkout-detail">Your total charge for your stay will be $<span className="important-info">{Number(paymentIntentData!.total) / 100}</span></div>
                    <CardElement className="card"/>
                    <button onClick={() => {
                        dispatch(resetPurchaseData());
                        navigate(`/listing/${paymentIntentData!.listing.id}`);
                    }} style={{marginBottom: '0.5rem'}} type="button">Cancel</button>
                    <button type="submit" disabled={!stripe || createReservationLoading}>{createReservationLoading ? 'PAYING' : 'PAY'}</button>
                </form>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 50%;
        outline: 1px solid black;
        padding: 1rem;
        .title {
            text-align: center;
            border-bottom: 1px solid black;
        }
        .images {
            margin: 1rem 0;
        }
        .checkout-detail {
            margin-bottom: 1rem;
            span {
                background-color: lightgray;
                padding: 0 0.25rem;
            }
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
        button {
            width: 100%;
            padding: 0.25rem;
        }
    }
`;

export default Checkout;