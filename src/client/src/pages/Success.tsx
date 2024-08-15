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
    padding-top:50px;
    div {
        display:flex;
        flex-direction:column;
        align-items: center;
        justify-content: center;;
    }
    h1 {
        font-size:24px;
        font-weight:600;
        text-align:center;
        margin-bottom:20px;
    }
    p {
        font-size: 16px;
    }
    a {
        height: 48px;
        color: #FFFFFF;
        font-weight: 500;
        border-radius: 12px;
        background-color: #2d814e;
        border-width: 0px;
        padding:0px 40px;
        display:flex;
        align-items: center;
        justify-content: center;
        cursor:pointer;
        font-size:14px;
        margin-top:50px;
        text-decoration:none;
    }
`;

export default Success;
