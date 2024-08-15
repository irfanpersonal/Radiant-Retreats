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
            {/* <button type="reset" onClick={() => dispatch(resetSearchBoxValues())}>Reset</button> */}
            <button type="submit">Submit</button>
        </Wrapper>
    );
}

const Wrapper = styled.form`
    padding: 15px;
    display:flex;
    flex-direction:row;
    align-items:flex-end;
    border-radius: 0px;
    background-color: #F5F5F4;
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

export default ReservationSearchBox;