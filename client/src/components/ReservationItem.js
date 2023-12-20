import noListingPhoto from '../images/no-listing-photo.jpeg';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';

const ReservationItem = ({data}) => {
    console.log(data);
    const {user} = useSelector(store => store.user);
    return (
        <Link style={{textDecoration: 'none', color: 'black'}} to={`/listing/${data.listing}`}>
            <article style={{border: '1px solid black', marginTop: '1rem', padding: '1rem', backgroundColor: 'lightgray'}}>
                <div style={{display: 'flex'}}>
                    {user?.role === 'customer' && (
                        <img style={{flex: '1', maxWidth: '25%', height: 'auto', marginRight: '1rem', border: '1px solid black'}} src={data.listingDetails.photos[0] || noListingPhoto}/>
                    )}
                    <div style={{flex: '3', border: '1px solid black', padding: '1rem', backgroundColor: 'white'}}>
                        <h1>Name of the Reservation: {data.listingDetails.name}</h1>
                        <h1>Address: {data.listingDetails.address}</h1>
                        <h1>Start: <span>{new Date(data.startDate).toISOString().split('T')[0]}</span>, End: <span>{new Date(data.endDate).toISOString().split('T')[0]}</span></h1>
                        {user?.role === 'owner' && (
                            <>
                                <h1>Customer Name: {data?.userDetails?.name}</h1>
                                <h1>Customer Email: {data?.userDetails?.email}</h1>
                            </>
                        )}
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default ReservationItem;
