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
            {/* <button onClick={() => {
                dispatch(resetSearchBoxValues());
            }} type="button">RESET</button> */}
            <button type="submit">SEARCH</button>
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
    overflow-x:auto;
    border: 1px solid rgba(17, 17, 17, 0.04);
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
        padding:0px 45px;
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

export default CashOutSearchBox;