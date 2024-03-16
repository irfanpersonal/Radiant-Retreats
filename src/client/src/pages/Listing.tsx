import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, ListingSearchBox, ListingList} from '../components';
import {resetSearchBoxValues, updateSearchBoxValues, setPage} from '../features/listing/listingSlice';
import {getAllListings} from '../features/listing/listingThunk';

const Listing: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getAllListingsLoading, listings, totalListings, numberOfPages, page, searchBoxValues} = useSelector((store: useSelectorType) => store.listing);
    React.useEffect(() => {
        dispatch(getAllListings());
    }, []);
    return (
        <Wrapper>
            <div className="container">
                <div className="twenty">
                    <ListingSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllListings} searchBoxValues={searchBoxValues}/>
                </div>
                <div className="seventy-five">
                    {getAllListingsLoading ? (
                        <Loading title="Loading All Users" position='normal'/>
                    ) : (
                        <ListingList data={listings} numberOfPages={numberOfPages as number} page={page as number} totalListings={totalListings as number} changePage={setPage} updateSearch={getAllListings}/>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .container {
        display: flex;
        .twenty {
            width: 20%;
        }
        .seventy-five {
            margin-left: auto;
            width: 75%;
        }
    }
`;

export default Listing;