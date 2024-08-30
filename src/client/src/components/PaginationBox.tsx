import styled from 'styled-components';
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {nanoid} from 'nanoid';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';

interface PaginationBoxProps {
    _id?: string,
    numberOfPages: number,
    changePage: Function,
    page: number,
    updateSearch: Function
}

const PaginationBox: React.FunctionComponent<PaginationBoxProps> = ({_id, page, numberOfPages, changePage, updateSearch}) => {
    const dispatch = useDispatch<useDispatchType>();
    const previousPage = () => {
        const newValue = page - 1;
        if (newValue === 0) {
            dispatch(changePage(numberOfPages));
            return;
        }
        dispatch(changePage(newValue));
    }
    const nextPage = () => {
        const newValue = page + 1;
        if (newValue === (numberOfPages + 1)) {
            dispatch(changePage(1));
            return;
        }
        dispatch(changePage(newValue));
    }
    return (
        <Wrapper>
            <span onClick={() => {
                previousPage();
                dispatch(updateSearch(_id));
            }}><IoIosArrowBack/></span>
            {Array.from({length: numberOfPages}, (_, index) => {
                return (
                    <span style={{filter: page === index + 1 ? 'invert(1)' : ''}} onClick={() => {
                        dispatch(changePage(index + 1));
                        dispatch(updateSearch(_id));
                    }} key={nanoid()}>{index + 1}</span>
                );
            })}
            <span onClick={() => {
                nextPage();
                dispatch(updateSearch(_id));
            }}><IoIosArrowForward/></span>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
    span {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        height: 2rem;
        min-width: 2rem;
        border: 1px solid rgb(231, 231, 231);
        margin: 0 0.5rem;
        background-color: white;
        color: black;
        transition: background-color 0.3s, border-color 0.3s;
    }
    span > svg {
        font-size: 1rem;
    }
`;

export default PaginationBox;