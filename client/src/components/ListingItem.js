import noListingPhoto from '../images/no-listing-photo.jpeg';
import {Link} from 'react-router-dom';
import {CiLocationOn, CiMoneyBill} from "react-icons/ci";

const ListingItem = ({data}) => {
    return (
        <Link to={`/listing/${data.id}`} style={{textDecoration: 'none', color: 'black'}}>
            <article style={{border: '1px solid black', margin: '1rem', padding: '1rem', backgroundColor: 'rgb(187, 171, 140)'}}>
                <img src={data.photos[0] || noListingPhoto} alt={data.name}/>
                <h1 style={{textAlign: 'center', marginTop: '1rem'}}>{data.name}</h1>
                <h1 style={{textAlign: 'center', marginTop: '1rem'}}><CiLocationOn/> {data.country}</h1>
                <h1 style={{textAlign: 'center', marginTop: '1rem'}}><CiMoneyBill/> {data.price}</h1>
            </article>
        </Link>
    );
}

export default ListingItem;