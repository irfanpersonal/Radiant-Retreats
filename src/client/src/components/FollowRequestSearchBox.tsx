import styled from 'styled-components';
import {countries} from '../utils/index';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {nanoid} from 'nanoid';

interface FollowRequestSearchBoxProps {
    searchBoxValues: {
        search: string,
        country: string,
        status: 'pending' | 'accepted' | 'rejected' | '',
        sort: 'latest' | 'oldest' | ''
    },
    updateSearchBoxValues: Function,
    resetSearchBoxValues: Function,
    updateSearch: Function,
    _id?: string
}

const FollowRequestSearchBox: React.FunctionComponent<FollowRequestSearchBoxProps> = ({searchBoxValues, updateSearchBoxValues, resetSearchBoxValues, updateSearch, _id}) => {
    const dispatch = useDispatch<useDispatchType>();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        dispatch(updateSearch(_id));
    }
    return (
        <Wrapper onSubmit={handleSubmit}>
            <div>
                <label htmlFor="search">Search</label>
                <input id="search" type="search" name="search" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={searchBoxValues.country} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    {countries.map(country => {
                        return (
                            <option key={nanoid()} value={country}>{country}</option>
                        );
                    })}
                </select>
            </div>
            <div>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={searchBoxValues.status} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">rejected</option>
                </select>
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
    label {
        display: block;
    }
    input, select, button {
        padding: 0.25rem;
        width: 100%;
        margin-bottom: 0.25rem;
    }
`;

export default FollowRequestSearchBox;