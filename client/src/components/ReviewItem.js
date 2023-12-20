import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {useDispatch, useSelector} from 'react-redux';
import {deleteReview, updateReview} from '../features/reviews/reviewsThunk.js';
import {useParams} from 'react-router-dom';

const ReviewItem = ({data}) => {
    const dispatch = useDispatch();
    const {id: listingID} = useParams();
    const {id, content, createdAt, rating, title, userDetails} = data;
    const {user} = useSelector(store => store.user);
    const {isDeletingReview, isEditingReview} = useSelector(store => store.review);
    const [input, setInput] = React.useState({
        rating,
        title,
        content,
        listing: listingID 
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const [edit, setEdit] = React.useState(false);
    return (
        <Wrapper>
            {edit ? (
                <form>
                    <div>
                        <label style={{textAlign: 'left'}} htmlFor="rating">Rating</label>
                        <input style={{width: '100%', padding: '0.5rem'}} id="rating" type="number" min="1" max="5" name="rating" value={input.rating} onChange={handleChange}/>
                    </div>
                    <div>
                        <label style={{textAlign: 'left'}} htmlFor="title">Title</label>
                        <input style={{width: '100%', padding: '0.5rem'}} id="title" type="text" name="title" value={input.title} onChange={handleChange}/>
                    </div>
                    <div>
                        <label style={{textAlign: 'left'}} htmlFor="content">Content</label>
                        <textarea style={{padding: '0.5rem', width: '100%'}} id="content" name="content" value={input.content} onChange={handleChange}></textarea>
                    </div>
                    {user?.name === userDetails?.name && (
                        <>
                            <button type="button" onClick={() => {
                                setEdit(false);
                            }}>CANCEL</button>
                            <button type="button" onClick={() => {
                                setEdit(true);
                                dispatch(updateReview({reviewID: id, review: input, listingID})); 
                            }} disabled={isEditingReview}>{isEditingReview ? 'EDITING' : 'EDIT'}</button>
                        </>
                    )}
                </form>
            ) : (
                <>
                    <div className="user-info">
                        <img src={userDetails.profilePicture || emptyProfilePicture} alt={userDetails.name} />
                        <p>{userDetails.name}</p>
                    </div>
                    <div className="review-content">
                        <h2>{title}</h2>
                        <p>{content}</p>
                    </div>
                    <div className="review-information">
                        <span className="rating">Rating: {rating}</span>
                        <span className="date">Created: {createdAt}</span>
                    </div>
                    {user?.name === userDetails?.name && (
                        <>
                            <button type="button" onClick={() => {
                                setEdit(true);
                            }}>EDIT</button>
                            <button type="button" onClick={() => {
                                dispatch(deleteReview({reviewID: id, listingID}));
                            }} disabled={isDeletingReview}>{isDeletingReview ? 'DELETING' : 'DELETE'}</button>
                        </>
                    )}
                </>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.article`
    border: 1px solid lightgray;
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: white;
    .user-info {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }
    .user-info img {
        border-radius: 50%;
        margin-right: 1rem;
        width: 50px;
        height: 50px;
    }
    .review-information {
        display: flex;
        justify-content: space-between;
        font-size: 1rem;
    }
    .rating {
        color: orange;
    }
`;

export default ReviewItem;