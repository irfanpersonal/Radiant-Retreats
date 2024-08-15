import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {Loading, UserSearchBox, UserList} from '../components';
import {resetSearchBoxValues, updateSearchBoxValues, setPage} from '../features/user/userSlice';
import {getAllUsers} from '../features/user/userThunk';

const User: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const {getAllUsersLoading, users, totalUsers, numberOfPages, page, searchBoxValues} = useSelector((store: useSelectorType) => store.user);
    React.useEffect(() => {
        dispatch(getAllUsers());
    }, []);
    return (
        <Wrapper>
            <div className="stacked">
                <div className="twenty">
                    <UserSearchBox resetSearchBoxValues={resetSearchBoxValues} updateSearchBoxValues={updateSearchBoxValues} updateSearch={getAllUsers} searchBoxValues={searchBoxValues}/>
                </div>
                <div className="seventy-five">
                    {getAllUsersLoading ? (
                        <Loading title="Loading All Users" position='normal'/>
                    ) : (
                        <UserList data={users} numberOfPages={numberOfPages as number} page={page as number} totalUsers={totalUsers as number} changePage={setPage} updateSearch={getAllUsers}/>
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .stacked {
        display:flex;
        flex-direction:column;
    }
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

export default User;