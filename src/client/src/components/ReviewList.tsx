import React from 'react';
import styled from 'styled-components';
import {type ReviewType} from '../features/reviews/reviewsSlice';
import {PaginationBox, ReviewListItem} from '../components';
import {nanoid} from 'nanoid';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

interface ReviewListProps {
    data: ReviewType[],
    totalReviews: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
    _id?: string
}

const ReviewList: React.FunctionComponent<ReviewListProps> = ({data, totalReviews, numberOfPages, page, changePage, updateSearch, _id}) => {
    return (
        <Wrapper>
            {totalReviews ? (
                null
            ): (
                <div className="noReviews">No Reviews Found</div>
            )}
            <section>
                {data.map(item => {
                    return (
                        <ReviewListItem data={item} key={nanoid()}/>
                    );
                })}
            </section>
            {numberOfPages! > 1 && (
                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={changePage} updateSearch={updateSearch} _id={_id}/>
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
        outline: 1px solid black;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .noReviews {
        display: flex;
        // padding: 20px;
        font-size:14px;
        margin-top: 40px;
        border-radius: 12px;
        flex-direction: row;
        align-items: center;
        justify-content:center;
        // background-color: #F5F5F4;
        // border: 1px solid rgba(17, 17, 17, 0.04);
    }
`;

export default ReviewList;