import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {getAllMyCashOuts, getEarningsData} from '../features/cashOut/cashOutThunk';
import {Loading, Modal, CashOut, CashOutList, CashOutSearchBox} from '../components';
import {setShowCashOutModal, setPage, resetSearchBoxValues, updateSearchBoxValues} from '../features/cashOut/cashOutSlice';

const Earnings: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const toggleModal = () => {
        dispatch(setShowCashOutModal(!showCashOutModal));
    }
    const {getEarningsDataLoading, earningsData, searchBoxValues, showCashOutModal, getAllMyCashOutsLoading, cashOuts, totalCashOuts, numberOfPages, page} = useSelector((store: useSelectorType) => store.cashOut);
    React.useEffect(() => {
        dispatch(getEarningsData());
        dispatch(getAllMyCashOuts());
    }, []);
    return (
        <Wrapper>
            <div>
                <CashOutSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllMyCashOuts} searchBoxValues={searchBoxValues}/>
            </div>

            {getEarningsDataLoading ? (
                <Loading title="Loading Earning" position='normal'/>
            ) : (
                <>
                    <div className="earnings-header">
                        <div>
                            <h1>Balance</h1>
                            <div className="balance">${earningsData!.balance}</div>
                        </div>
                        
                        <button onClick={toggleModal} type="button" disabled={!earningsData!.canCashOut || earningsData!.balance === 0}>Cash Out</button>
                    </div>
                    
                    {showCashOutModal && (
                        <Modal title='Card Information' toggleModal={toggleModal}>
                            <CashOut balance={earningsData!.balance} toggleModal={toggleModal}/>
                        </Modal>
                    )}
                </>
            )}
            
            
            {getAllMyCashOutsLoading ? (
                <Loading title="Loading My Cash Outs" position='normal'/>
            ) : (
                <div className="">
                    <CashOutList data={cashOuts} numberOfPages={numberOfPages as number} page={page as number} totalCashOuts={totalCashOuts as number} changePage={setPage} updateSearch={getAllMyCashOuts}/>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .earnings-header {
        padding:30px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content: space-between;
        border-bottom:1px solid #e7e7e7;
        h1 {
            font-size:24px;
            font-weight:500;
        }
        button {
            height: 48px;
            padding: 0px 40px;
            color: #FFFFFF;
            font-weight: 500;
            border-width: 0px;
            border-radius: 12px;
            background-color: #000000;
        }
    }
`;

export default Earnings;