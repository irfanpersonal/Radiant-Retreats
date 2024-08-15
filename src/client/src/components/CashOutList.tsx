import React from 'react';
import styled from 'styled-components';
import {type CashOutType} from '../features/cashOut/cashOutSlice';
import {PaginationBox, CashOutListItem} from '../components';
import {nanoid} from 'nanoid';
import { CiFilter, CiGrid41, CiGrid2H } from "react-icons/ci";

type ViewType = 'grid' | 'list';

interface CashOutListProps {
    data: CashOutType[],
    totalCashOuts: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
    _id?: string
}

const CashOutList: React.FunctionComponent<CashOutListProps> = ({data, totalCashOuts, numberOfPages, page, changePage, updateSearch, _id}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <Wrapper>
            {totalCashOuts ? (
                <div className="pageHeader">
                    <div>{totalCashOuts} Cash Out{totalCashOuts! > 1 && 's'} Found.</div>
                    <div className="listingType">
                        <div className={`listingTypeItem ${viewType === 'grid' ? 'active' : ''}`} onClick={() => setViewType('grid')}>
                            <CiGrid41 size={'20px'} color={'#717171'} />
                        </div>
                        <div className={`listingTypeItem ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
                            <CiGrid2H size={'20px'} color={'#717171'} />
                        </div>
                    </div>
                </div>
            ): (
                <div style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>No Cash Out Found</div>
            )}
            <section className={`${viewType !== 'grid' ? 'list-styling' : ''}${viewType === 'grid' ? 'grid-styling' : ''}`}>
                {data.map(item => {
                    return (
                        <CashOutListItem data={item} key={nanoid()}/>
                    );
                })}
            </section>
            {numberOfPages! > 1 && (
                <PaginationBox numberOfPages={numberOfPages!} page={page} changePage={changePage} updateSearch={updateSearch} _id={_id}/>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.section`
    .pageHeader {
        padding:30px;
        display:flex;
        flex-direction:row;
        align-items:center;
        justify-content: space-between;
        h1 {
            font-size:24px;
            font-weight:600;
        }
    }
    .listingType {
        padding:3px;
        display:flex;
        flex-direction:row;
        border-radius:12px;
        background-color:#F3F3F2;
    }
    .listingTypeItem {
        width:34px;
        height:34px;
        margin:3px;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .listingTypeItem.active {
        border-radius:8px;
        background-color:#000000;
    }
    .listingTypeItem.active svg {
        color:#FFFFFF !important;
    }
    .grid-styling {
        padding:0px 30px;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
    }
    .list-styling {
        padding:0px 30px;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        .cashoutItem a {
            
        }
    }
`;

export default CashOutList;