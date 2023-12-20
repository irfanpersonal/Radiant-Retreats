import React from 'react';
import {useSelector} from 'react-redux';
import {Link, useNavigate} from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();
    const {successfulOrder} = useSelector(store => store.listing);
    React.useEffect(() => {
        if (!successfulOrder) {
            navigate('/');
        }
    }, []);
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Thank you. Your purchase was successful!</h1>
            <Link style={{display: 'block', textAlign: 'center', marginTop: '1rem', backgroundColor: 'lightgray', padding: '1rem', textDecoration: 'none', color: 'black', outline: '1px solid black'}} to='/reservations'>Go to all Reservations</Link>
        </div>
    );
}

export default Success;