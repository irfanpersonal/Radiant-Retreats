import styled from 'styled-components';
import {type ListingType} from '../features/listing/listingSlice';
import {ImageViewer} from '../components';
import {Link} from 'react-router-dom';

interface ListingListItemProps {
    data: ListingType
}

const ListingListItem: React.FunctionComponent<ListingListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <ImageViewer data={data.photos} viewType='simple' fullWidth={false}/>
            <div className="listing-item-detail">{data.name}</div>
            <div className="listing-item-detail">${Number(data.price) / 100}</div>
            <Link to={`/listing/${data.id}`}>View More</Link>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    text-decoration: none;
    color: black;
    outline: 1px solid black;
    padding: 1rem;
    text-align: center;
    margin-top: 1rem;
    a {
        display: block;
        color: black;
        text-decoration: none;
        background-color: lightgray;
        padding: 0 2rem;
        margin-top: 1rem;
    }
    a:hover, a:active {
        outline: 1px solid black;
    }
    .listing-item-detail {
        margin-top: 0.5rem;
    }
`;

export default ListingListItem;