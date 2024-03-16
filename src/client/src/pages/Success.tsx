import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, type useSelectorType} from '../store';
import {useNavigate, Link} from 'react-router-dom';
import {resetPurchaseData} from '../features/reservation/reservationSlice';

const Success: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const navigate = useNavigate();
    const {successfullyPayed, successfulPaymentInfo} = useSelector((store: useSelectorType) => store.reservation);
    React.useEffect(() => {
        if (!successfullyPayed) {
            navigate('/');
        }
        // In a useEffect you can return whats called a clean up function. This is 
        // logic that runs when the component unmounts. Or in simpler words when 
        // you navigate away from this component/page.
        return () => {
            // console.log('This is a clean up function');
            dispatch(resetPurchaseData());
        }
    }, []);
    return (
        <Wrapper>
            {successfullyPayed && (
                <div>
                    <h1>Booking Successful!</h1>
                    <p>Congratulations! Your stay has been successfully booked.</p>
                    <p>Thank you for choosing our services. We look forward to hosting you!</p>
                    <Link to={`/reservation/${successfulPaymentInfo!?.id}`}>View Reservation</Link>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    padding: 1rem;
    margin: 0 auto;
    text-align: center;
    div {
        margin-top: 3rem;
    }
    h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }
    p {
        font-size: 1.25rem;
        line-height: 1.6;
        margin-bottom: 1rem;
    }
    a {
        background-color: lightgray;
        padding: 0.25rem 1rem;
        border-radius: 0.25rem;
        text-decoration: none;
        color: black;
    }
    a:hover, a:active {
        outline: 1px solid black;
    }
`;

export default Success;
