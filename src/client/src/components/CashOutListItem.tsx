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
            {/* <div className="cash"><FaMoneyBill/></div> */}
            <div className="comboItem">
                <div className="cashoutItem">
                    <span>Created:</span>
                    <div>{moment(data.createdAt).utc().format('MMMM Do YYYY')}</div>
                </div>
                <div className="cashoutItem">
                    <span>Amount:</span>
                    <div>${data.amount}</div>
                </div>
            </div>
       
            <div className="comboItem">
                <div className="cashoutItem">
                    <span>Status:</span>
                    <div>{capitalizeFirstLetter(data.status)}</div>
                </div>

                <div className="cashoutItem">
                    <Link to={`/cash-out/${data.id}`}>View Details</Link>
                </div>

            </div>
            
            
    
            
        </Wrapper>
    );
}

const Wrapper = styled.article`
    padding:12px;
    border-radius:20px;
    background-color: #F5F5F4;
    border: 1px solid rgba(17, 17, 17, 0.04);
    .comboItem {
        display:flex;
        flex-direction:row;
        align-items:flex-end;
        .cashoutItem {
            flex:1;
            display:flex;
            flex-direction:column;
            padding:12px;
        }
        span {
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        div {
            font-size:14px;
        }
        a {
            height: 48px;
            font-size:14px;
            display:flex;
            color: #FFFFFF;
            font-weight: 500;
            border-width: 0px;
            border-radius: 12px;
            align-items: center;
            justify-content: center;
            background-color: #2d814e;
            text-decoration:none;
        }
    }
`;

export default CashOutListItem;