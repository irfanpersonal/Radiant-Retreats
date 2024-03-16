import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';

interface CashOutSearchBoxProps {
    resetSearchBoxValues: Function,
    updateSearchBoxValues: Function,
    updateSearch: Function,
    searchBoxValues: {
        status: 'pending' | 'paid' | '',
        sort: 'oldest' | 'latest' | ''
    }
}

const CashOutSearchBox: React.FunctionComponent<CashOutSearchBoxProps> = ({resetSearchBoxValues, updateSearch, updateSearchBoxValues, searchBoxValues}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(updateSearch());
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={searchBoxValues.status} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                </select>
            </div>
            <div>
                <label htmlFor="sort">Sort</label>
                <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="oldest">Oldest</option>
                    <option value="latest">Latest</option>
                </select>
            </div>
            <button onClick={() => {
                dispatch(resetSearchBoxValues());
            }} type="button">RESET</button>
            <button type="submit">SEARCH</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    outline: 1px solid black;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: lightgray;
    border-radius: 0.5rem;
    label {
        display: block;
    }
    input, select, button {
        padding: 0.25rem;
        width: 100%;
        margin-bottom: 0.5rem;
    }
`;

export default CashOutSearchBox;