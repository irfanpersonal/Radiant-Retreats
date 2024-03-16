import styled from 'styled-components';
import moment from 'moment';
import {type CashOutType} from '../features/cashOut/cashOutSlice';
import {FaMoneyBill} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import {capitalizeFirstLetter} from '../utils';

interface CashOutListItemProps {
    data: CashOutType
}

const CashOutListItem: React.FunctionComponent<CashOutListItemProps> = ({data}) => {
    return (
        <Wrapper>
            <div className="cash"><FaMoneyBill/></div>
            <div>{moment(data.createdAt).utc().format('MMMM Do YYYY')}</div>
            <div>${data.amount}</div>
            <div>Status: {capitalizeFirstLetter(data.status)}</div>
            <Link to={`/cash-out/${data.id}`}>View More</Link>
        </Wrapper>
    );
}

const Wrapper = styled.article`
    outline: 1px solid black;
    padding: 1rem;
    margin-top: 1rem;
    text-align: center;
    .cash {
        border-bottom: 1px solid black;
        margin-bottom: 0.5rem;
    }
    a {
        display: block;
        background-color: lightgray;
        padding: 0 0.5rem;
        border-radius: 1rem;
        color: black;
        text-decoration: none;
        margin-top: 0.5rem;
    }
    a:hover {
        outline: 1px solid black;
    }
`;

export default CashOutListItem;