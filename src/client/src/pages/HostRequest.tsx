import React from 'react';
import styled from 'styled-components';
import {getAllHostRequests} from '../features/hostRequest/hostRequestThunk';
import {useDispatch, useSelector} from 'react-redux';
import {useDispatchType, useSelectorType} from '../store';
import {FollowRequestSearchBox, HostRequestList} from '../components';
import {Loading} from '../components';
import {setPage, updateSearchBoxValues, resetSearchBoxValues} from '../features/hostRequest/hostRequestSlice';

const HostRequest: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getAllHostRequestsLoading, hostRequests, totalHostRequests, numberOfPages, page, searchBoxValues} = useSelector((store: useSelectorType) => store.hostRequest);
    React.useEffect(() => {
        dispatch(getAllHostRequests());
    }, []);
    return (
        <Wrapper>
            <div className="stacked">
                <div className="twenty">
                    <FollowRequestSearchBox searchBoxValues={searchBoxValues} updateSearchBoxValues={updateSearchBoxValues} resetSearchBoxValues={resetSearchBoxValues} updateSearch={getAllHostRequests}/>
                </div>
                <div className="seventy-five">
                    {getAllHostRequestsLoading ? (
                        <Loading title='Loading Host Requests' position='normal' marginTop='1rem'/>
                    ) : (
                        <HostRequestList data={hostRequests} numberOfPages={numberOfPages as number} page={page as number} totalHostRequests={totalHostRequests as number} changePage={setPage} updateSearch={getAllHostRequests}/>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .container {
        display: flex;
        .twenty {
            width: 20%;
        }
        .seventy-five {
            margin-left: auto;
            width: 75%;
        }
    }
`;

export default HostRequest;