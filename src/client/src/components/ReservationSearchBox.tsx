import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';

interface ReservationSearchBoxProps {
    searchBoxValues: {
        sort: 'latest' | 'oldest' | '',
        startDate: string,
        endDate: string
    },
    updateSearchBoxValues: Function,
    resetSearchBoxValues: Function,
    updateSearch: Function,
    _id?: string
}

const ReservationSearchBox: React.FunctionComponent<ReservationSearchBoxProps> = ({searchBoxValues, updateSearchBoxValues, resetSearchBoxValues, updateSearch, _id}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(updateSearch(_id));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <div>
                <label htmlFor="startDate">Start Date Range</label>
                <input id="startDate" name="startDate" type="date" value={searchBoxValues.startDate} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="endDate">End Date Range</label>
                <input id="endDate" name="endDate" type="date" value={searchBoxValues.endDate} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="sort">Sort</label>
                <select id="sort" name="sort" value={searchBoxValues.sort} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
            <button type="reset" onClick={() => dispatch(resetSearchBoxValues())}>Reset</button>
            <button type="submit">Submit</button>
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

export default ReservationSearchBox;