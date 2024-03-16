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
            {getEarningsDataLoading ? (
                <Loading title="Loading Earning" position='normal'/>
            ) : (
                <>
                    <div className="earnings-header">
                        <h1>Balance</h1>
                        <button onClick={toggleModal} type="button" disabled={!earningsData!.canCashOut || earningsData!.balance === 0}>Cash Out</button>
                    </div>
                    <h1 className="balance">${earningsData!.balance}</h1>
                    {showCashOutModal && (
                        <Modal title='Card Information' toggleModal={toggleModal}>
                            <CashOut balance={earningsData!.balance} toggleModal={toggleModal}/>
                        </Modal>
                    )}
                </>
            )}
            <div style={{marginTop: '1rem'}}>
                <CashOutSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllMyCashOuts} searchBoxValues={searchBoxValues}/>
            </div>
            {getAllMyCashOutsLoading ? (
                <Loading title="Loading My Cash Outs" position='normal'/>
            ) : (
                <div className="margin-top">
                    <CashOutList data={cashOuts} numberOfPages={numberOfPages as number} page={page as number} totalCashOuts={totalCashOuts as number} changePage={setPage} updateSearch={getAllMyCashOuts}/>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .earnings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        padding-bottom: 0.5rem;
        button {
            width: 20%;
            padding: 0.25rem 0.5rem;
        }
    }
    .balance {
        margin-top: 0.5rem;
    }
    .margin-top {
        margin-top: 0.25rem;
    }
`;

export default Earnings;