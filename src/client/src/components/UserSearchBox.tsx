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
                <input placeholder="Search here" id="search" type="search" name="search" value={searchBoxValues.search} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}/>
            </div>
            <div>
                <label htmlFor="role">Role</label>
                <select id="role" name="role" value={searchBoxValues.role} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value="">All</option>
                    <option value="guest">Guest</option>
                    <option value="host">Host</option>
                </select>
            </div>
            <div>
                <label htmlFor="country">Country</label>
                <select id="country" name="country" value={searchBoxValues.country} onChange={(event) => dispatch(updateSearchBoxValues({name: event.target.name, value: event.target.value}))}>
                    <option value="">Anywhere</option>
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
                    <option value="">Select</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
            <button type="submit">Submit</button>
            {/* <button type="reset" onClick={() => dispatch(resetSearchBoxValues())}>Reset</button> */}
            
        </Wrapper>
    );
}

const Wrapper = styled.form`
    padding: 0px 15px;
    display:flex;
    flex-direction:row;
    align-items:flex-end;
    border-radius: 0px;
    background-color: #F5F5F4;
    border: 1px solid rgba(17, 17, 17, 0.04);
    overflow-x:auto;
    div {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 15px;
    }
    label {
        color: #717171;
        font-size: 12px;
        margin-bottom: 10px;
    }
    input, select {
        flex: 1;
        display: flex;
        font-size:14px;
        border-width: 0px;
        border-radius: 12px;
        background-color: #FFFFFF;
        padding: 14px 14px 14px 14px;
    }
    button[type="submit"] {
        margin:15px;
        height: 49px;
        padding:0px 80px;
        color: #FFFFFF;
        font-weight: 500;
        border-width: 0px;
        border-radius: 12px;
        background-color: #2d814e;
    }
    button[type="reset"] {
        margin:15px;
        height: 49px;
        padding:0px 80px;
        color: #FFFFFF;
        font-weight: 500;
        border-width: 0px;
        border-radius: 12px;
        background-color: #d13b53;
    }
`;

export default UserSearchBox;