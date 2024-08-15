import React from 'react';
import styled from 'styled-components';
import { type ListingType } from '../features/listing/listingSlice';
import { PaginationBox, ListingListItem } from '../components';
import { nanoid } from 'nanoid';
import { MdGridView } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";

export type ViewType = 'grid' | 'list';

interface ListingListProps {
    data: ListingType[],
    totalListings: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
    viewType: ViewType,
    setViewType: React.Dispatch<React.SetStateAction<ViewType>>,
    _id?: string
}

const ListingList: React.FunctionComponent<ListingListProps> = ({ data, totalListings, numberOfPages, page, changePage, updateSearch, viewType, setViewType, _id }) => {
    return (
        <Wrapper>
            {totalListings ? (
                <div className="list-info displayNone">
                    <div>{totalListings} Listing{totalListings !== 1 ? 's' : ''} Found...</div>
                    <div>
                        <MdGridView onClick={() => setViewType('grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`} />
                        <GiHamburgerMenu onClick={() => setViewType('list')} className={`view-type ${viewType === 'list' && 'active-type'}`} />
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '1rem', textDecoration: 'underline' }}>No Listing Found</div>
            )}
            <section className={`${viewType !== 'grid' ? 'list-styling' : ''}${viewType === 'grid' ? 'grid-styling' : ''}`}>
                {data.map(item => (
                    <ListingListItem data={item} key={nanoid()} />
                ))}
            </section>
            {numberOfPages > 1 && (
                <PaginationBox numberOfPages={numberOfPages} page={page} changePage={changePage} updateSearch={updateSearch} _id={_id} />
            )}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .list-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
    }
    .view-type {
        cursor: pointer;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
    .grid-styling {
        display: grid;
        padding:30px;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }
    .list-styling {
        display: grid;
        padding:30px;
        grid-template-columns: repeat(1, 1fr);
        gap: 30px;
        .listingImageIco {
            height:400px;
        }
        .listing-item-footer {
            padding-top:20px;
        }
    }
`;

export default ListingList;