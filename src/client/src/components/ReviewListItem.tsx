import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type ReviewType} from '../features/reviews/reviewsSlice';
import {deleteSingleReview, updateSingleReview} from '../features/reviews/reviewsThunk';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {useParams} from 'react-router-dom';

interface ReviewListItemProps {
    data: ReviewType
}

const ReviewListItem: React.FunctionComponent<ReviewListItemProps> = ({data}) => {
    const {id: listingID} = useParams();
    const dispatch = useDispatch<useDispatchType>();
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const handleEdit = (reviewID: string) => {
        const titleValue = (document.querySelector('#title') as HTMLInputElement).value;
        const ratingValue = (document.querySelector('#rating') as HTMLInputElement).value;
        const contentValue = (document.querySelector('#content') as HTMLInputElement).value;
        if (!titleValue || !ratingValue || !contentValue) {
            if (!(document.querySelector('#title') as HTMLInputElement).value) {
                (document.querySelector('#title') as HTMLDivElement).style.border = '1px solid red';
                setTimeout(() => {
                    (document.querySelector('#title') as HTMLDivElement).style.border = '';
                }, 2000);
                return;
            }
            if (!(document.querySelector('#rating') as HTMLInputElement).value) {
                (document.querySelector('#rating') as HTMLDivElement).style.border = '1px solid red';
                setTimeout(() => {
                    (document.querySelector('#rating') as HTMLDivElement).style.border = '';
                }, 2000);
                return;
            }
            if (!(document.querySelector('#content') as HTMLInputElement).value) {
                (document.querySelector('#content') as HTMLDivElement).style.border = '1px solid red';
                setTimeout(() => {
                    (document.querySelector('#content') as HTMLDivElement).style.border = '';
                }, 2000);
                return;
            }
        }
        const formData = new FormData();
        formData.append('title', titleValue);
        formData.append('rating', ratingValue);
        formData.append('content', contentValue);
        dispatch(updateSingleReview({listingID: listingID!, reviewID: reviewID!, data: formData}));
    }
    return (
        <Wrapper>
            <div className="user-info">
                <div className="flex">
                    <img className="user-pfp" src={data!.user.profilePicture || emptyProfilePicture} alt={data!.user.firstName}/>
                    <div>{data!.user.firstName}</div>
                </div>
                {data!.isMyComment && (
                    <div className="btn" onClick={() => {
                        dispatch(deleteSingleReview({listingID: listingID!, reviewID: data!.id}));
                    }}>Delete</div>
                )}
            </div>
            <div className="review-header">
                <div>{isEditing ? (<input id="title" name="title" type="text" defaultValue={data.title} required/>) : (data.title)}</div>
                <div>{isEditing ? (<input id="rating" name="rating" type="number" min="1" max="5" defaultValue={data.rating} required/>) : (`⭐️ ${data.rating}`)}</div>
            </div>
            <p>{isEditing ? (<textarea id="content" name="content" defaultValue={data.content} required></textarea>) : (data.content)}</p>
            {data.isMyComment && (
                <div className="btn" onClick={() => {
                    setIsEditing(currentState => {
                        return !currentState;
                    });
                }}>{isEditing ? 'Cancel' : 'Edit'}</div>
            )}
            {isEditing && (
                <div onClick={() => handleEdit(data.id)} className="btn margin-left">Edit</div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    border-radius: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-top: 1rem;
    & > div {
        margin-bottom: 15px;
    }
    div {
        font-size: 1.25rem;
        font-weight: bold;
        color: #333;
    }
    p {
        color: gray;
        line-height: 1.5;
    }
    .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .flex {
            display: flex;
            align-items: center;
        }
        .user-pfp {
            width: 3rem;
            height: 3rem;
            outline: 1px solid black;
            margin-right: 1rem;
        }
    }
    .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid black;
        padding-bottom: 0.5rem;
    }
    .btn {
        display: inline-block;
        cursor: pointer;
        background-color: lightgray;
        outline: 1px solid black;
        min-width: 15%;
        padding: 0.25rem 0.5rem;
        text-align: center;
        margin-top: 1rem;
    }
    .btn:hover, .btn:active {
        background-color: white;
    }
    .margin-left {
        margin-left: 1rem;
    }
    input, textarea {
        padding: 0.25rem;
    }
    textarea {
        width: 100%;
        height: 5rem;
        resize: none;
    }
    .error-message {
        color: red;
        outline: 1px solid black;
        padding: 0.25rem;
        margin-top: 1rem;
        display: flex;
        align-items: center;
        svg {
            margin-right: 0.5rem;
        }
    }
`;

export default ReviewListItem;