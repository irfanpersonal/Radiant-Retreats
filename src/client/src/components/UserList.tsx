import React from 'react';
import styled from 'styled-components';
import {type UserType} from '../features/user/userSlice';
import {PaginationBox, UserListItem} from '../components';
import {nanoid} from 'nanoid';
import {MdGridView} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";

type ViewType = 'grid' | 'list';

interface UserListProps {
    data: UserType[],
    totalUsers: number,
    numberOfPages: number,
    page: number,
    changePage: Function,
    updateSearch: Function,
    _id?: string
}

const UserList: React.FunctionComponent<UserListProps> = ({data, totalUsers, numberOfPages, page, changePage, updateSearch, _id}) => {
    const [viewType, setViewType] = React.useState<ViewType>('grid');
    return (
        <Wrapper>
            {totalUsers ? (
                <div className="list-info">
                    <div>{totalUsers} User{totalUsers! > 1 && 's'} Found...</div>
                    <div>
                        <MdGridView onClick={() => setViewType(currentState => 'grid')} className={`view-type ${viewType === 'grid' && 'active-type'}`}/>
                        <GiHamburgerMenu onClick={() => setViewType(currentState => 'list')} className={`view-type ${viewType === 'list' && 'active-type'}`}/>
                    </div>
                </div>
            ) : (
                <div style={{textAlign: 'center', marginTop: '1rem', textDecoration: 'underline'}}>No Users Found</div>
            )}
            <section className={`${viewType === 'grid' && 'grid-styling'}`}>
                {data.map(item => {
                    return (
                        <UserListItem data={item} key={nanoid()}/>
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
    .list-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        margin-bottom: 1rem;
    }
    .view-type {
        cursor: pointer;
        font-size: 1.5rem;
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 0.5rem;
        outline: 1px solid black;
    }
    .active-type {
        background-color: rgb(146, 199, 207);
    }
    .grid-styling {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
`;

export default UserList;