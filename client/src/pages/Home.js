import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {getAllListings} from '../features/home/homeThunk';
import {ListingList, PaginationBox} from '../components';
import {setPage} from '../features/home/homeSlice.js';

const Home = () => {
    const dispatch = useDispatch();
    const {isLoading, listings, totalListings, numberOfPages, page} = useSelector(store => store.home);
    React.useEffect(() => {
        dispatch(setPage(1));
    }, []);
    React.useEffect(() => {
        dispatch(getAllListings());
    }, [page]);
    return (
        <Wrapper>
            {isLoading ? (
                <h1>Loading All Listings...</h1>
            ) : (
                <>
                    <ListingList data={listings} title="All Listings" totalListings={totalListings}/>
                    <PaginationBox numberOfPages={numberOfPages} page={page} setPage={setPage}/>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    img {
        width: 150px;
        height: 150px;
        display: block;
        margin: 0 auto;
        border: 1px solid black;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    }
`;

export default Home;