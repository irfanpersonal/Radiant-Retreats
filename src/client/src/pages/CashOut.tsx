import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, CashOutSearchBox, CashOutList} from '../components';
import {getAllCashOuts} from '../features/cashOut/cashOutThunk';
import {setPage, resetSearchBoxValues, updateSearchBoxValues} from '../features/cashOut/cashOutSlice';

const CashOut: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getAllCashOutsLoading, searchBoxValues, cashOuts, totalCashOuts, numberOfPages, page} = useSelector((store: useSelectorType) => store.cashOut);
    React.useEffect(() => {
        dispatch(getAllCashOuts());
    }, []);
    return (
        <Wrapper>
            <div className="container">
                <div className="twenty-five">
                    <CashOutSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllCashOuts} searchBoxValues={searchBoxValues}/>
                </div>
                <div className="seventy-five">
                    {getAllCashOutsLoading ? (
                        <Loading title="Loading All Cash Outs" position='normal'/>
                    ) : (
                        <CashOutList data={cashOuts} numberOfPages={numberOfPages as number} page={page as number} totalCashOuts={totalCashOuts as number} changePage={setPage} updateSearch={getAllCashOuts}/>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .container {
        display: flex;
        .twenty-five {
            width: 23%;
        }
        .seventy-five {
            margin-left: auto;
            width: 75%;
        }
    }
`;

export default CashOut;