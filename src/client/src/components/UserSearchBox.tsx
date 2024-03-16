import styled from 'styled-components';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {countries} from '../utils';
import {nanoid} from 'nanoid';

interface UserSearchBoxProps {
    searchBoxValues: {
        search: string,
        role: 'guest' | 'admin' | '',
        country: string,
        sort: 'latest' | 'oldest' | ''
    },
    updateSearchBoxValues: Function,
    resetSearchBoxValues: Function,
    updateSearch: Function,
    _id?: string
}

const UserSearchBox: React.FunctionComponent<UserSearchBoxProps> = ({searchBoxValues, updateSearchBoxValues, resetSearchBoxValues, updateSearch, _id}) => {
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
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={searchBoxValues.role} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value=""></option>
                    <option value="guest">Guest</option>
                    <option value="host">Host</option>
                </select>
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
        margin-bottom: 0.25rem;
    }
`;

export default UserSearchBox;