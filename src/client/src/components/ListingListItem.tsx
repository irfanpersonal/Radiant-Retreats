import styled from 'styled-components';
import {type ListingType} from '../features/listing/listingSlice';
import {ImageViewer} from '../components';
import {Link} from 'react-router-dom';
import { FaStar } from "react-icons/fa6";

interface ListingListItemProps {
    data: ListingType
}

const ListingListItem: React.FunctionComponent<ListingListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <Link to={`/listing/${data.id}`} className="listingItem">
            <ImageViewer data={data.photos} viewType='simple' fullWidth={false}/>
            <div className="listingBody">
                <div>
                    <div className="listing-item-title">{data.name}</div>
                    <div className="listing-item-subline">{data.country}</div>
                </div>
                <div className="listing-item-footer">
                    <div className="listing-item-price">${Number(data.price) / 100}<span> / night</span></div>
                    <div className="listing-item-rating">
                        <FaStar size={'14px'} color={'#111111'}/>
                        <div className="listing-item-rating-label">{Number(data.averageRating) === 0 ? "New" : data.averageRating}</div>
                    </div>
                </div>
            </div>
            </Link>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    .listingItem {
        display:flex;
        flex-direction:column;
        overflow:hidden;
        border-radius:20px;
        text-decoration:none;
        border:1px solid #e7e7e7;
    }
    .listingBody {
        display:flex;
        padding:20px;
        min-height:175px;
        flex-direction: column;
        justify-content: space-between;
    }
    .listing-item-title {
        color:#111111;
        font-size:18px;
        font-weight:500;
    }
    .listing-item-subline {
        font-size:14px;
        color:#717171;
        margin-top:4px;
    }
    .listing-item-price {
        color:#111111;
        font-size:14px;
        font-weight:500;
    }
    .listing-item-price span {
        color:#717171;
        font-weight:400;
    }
    .listing-item-footer {
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content:space-between;
    }
    .listing-item-rating {
        display:flex;
        flex-direction:row;
        align-items:center;
    }
    .listing-item-rating svg {
        margin-top:-2px;
    }
    .listing-item-rating-label {
        color:#111111;
        font-size:14px;
        padding-left:8px;
    }
`;

export default ListingListItem;