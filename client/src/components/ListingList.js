import ListingItem from "./ListingItem";
import {nanoid} from 'nanoid'

const ListingList = ({data, title, totalListings}) => {
    return (
        <section style={{marginTop: '1rem', border: '1px solid black'}}>
            <h1 style={{textAlign: 'center', backgroundColor: 'black', color: 'white'}}>{title}</h1>
            {totalListings > 0 ? (
                <h1 style={{marginLeft: '1rem', marginTop: '1rem'}}>{totalListings} Listing{totalListings > 1 && 's'} Found ...</h1>
            ) : (
                <h1 style={{marginLeft: '1rem', marginTop: '1rem', textAlign: 'center'}}>No Listings Found!</h1>
            )}
            {data.map(item => {
                return <ListingItem key={nanoid()} data={item}/>
            })}
        </section>
    );
}

export default ListingList;