import React from 'react';
import styled from 'styled-components';
import {createReview} from '../features/reviews/reviewsThunk';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';

const CreateComment = ({toggleCommentBox}) => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const {isLoadingCreateReview} = useSelector(store => store.review);
    const [input, setInput] = React.useState({
        rating: '',
        title: '',
        content: '',
        listing: id
    });
    const handleChange = (event) => {
        setInput(currentState => {
            return {...currentState, [event.target.name]: event.target.value};
        });
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        dispatch(createReview({review: input, listingID: id}));
    };
    return (
        <Wrapper onSubmit={handleSubmit}>
            <h1>Add Review</h1>
            <div>
                <label style={{textAlign: 'left'}} htmlFor="rating">Rating</label>
                <input id="rating" type="number" min="1" max="5" name="rating" value={input.rating} onChange={handleChange}/>
            </div>
            <div>
                <label style={{textAlign: 'left'}} htmlFor="title">Title</label>
                <input id="title" type="text" name="title" value={input.title} onChange={handleChange}/>
            </div>
            <div>
                <label style={{textAlign: 'left'}} htmlFor="content">Content</label>
                <textarea style={{padding: '0.5rem'}} id="content" name="content" value={input.content} onChange={handleChange}></textarea>
            </div>
            <button type="button" onClick={toggleCommentBox}>CANCEL</button>
            <button type="submit" disabled={isLoadingCreateReview}>{isLoadingCreateReview ? 'CREATING' : 'CREATE'}</button>
        </Wrapper>
    );
};

const Wrapper = styled.form`
    border: 1px solid black;
    padding: 1rem;
    margin-top: 1rem;
    h1 {
        text-align: center;
        background-color: black;
        color: white;
        padding: 0.5rem;
    }
    label, input {
        display: block;
    }
    input {
        width: 100%;
        padding: 0.5rem;
    }
    textarea {
        width: 100%;
        height: 100px;
    }
`;

export default CreateComment;