import React from 'react';
import styled from 'styled-components';
import emptyProfilePicture from '../images/empty-profile-picture.jpeg';
import {type ReviewType} from '../features/reviews/reviewsSlice';
import {deleteSingleReview, updateSingleReview} from '../features/reviews/reviewsThunk';
import {useDispatch} from 'react-redux';
import {type useDispatchType} from '../store';
import {useParams} from 'react-router-dom';
import { FaStar } from "react-icons/fa6";

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
                    <div className="user-info-meta">
                        <div className="user-info-meta-left">
                            <div className="user-info-name">{data!.user.firstName}</div>
                            <div className="review-info-rating"><FaStar size={'14px'} color={'#111111'}/> {isEditing ? (<input id="rating" name="rating" type="number" min="1" max="5" defaultValue={data.rating} required/>) : (`${data.rating}`)}</div>
                        </div>
                        
                        <div className="review-info-title">{isEditing ? (<input id="title" name="title" type="text" defaultValue={data.title} required/>) : (data.title)}</div>
                        
                    </div>
                    
                </div>
                
            </div>
         
            <div className="reviewContent">
                {isEditing ? 
                    (<textarea id="content" name="content" defaultValue={data.content} required></textarea>) 
                    : 
                    (<div>{data.content}</div>) 
                }
            </div>
            
            <div className="reviewActions">
                {isEditing && (
                    <div className="reviewEdit" onClick={() => handleEdit(data.id)}>Submit</div>
                )}
                {data.isMyComment && (
                    <div className="reviewCancel" onClick={() => {
                        setIsEditing(currentState => {
                            return !currentState;
                        });
                    }}>{isEditing ? 'Cancel' : 'Edit'}</div>
                )}
                
                {data!.isMyComment && (
                    <div className="reviewDelete" onClick={() => {
                        dispatch(deleteSingleReview({listingID: listingID!, reviewID: data!.id}));
                    }}>Delete</div>
                )}

            </div>
            
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin: 20px 0px;
    padding: 20px 20px;
    border-bottom: 1px solid #e7e7e7;
    background-color: #f5f5f4;
    border: 1px solid rgba(17, 17, 17, 0.04);
    border-radius: 20px;

    .user-info {
        display: flex;
        flex-direction:row;
        align-items: center;
        justify-content: space-between;
        .flex {
            flex:1;
            display: flex;
            align-items: center;
        }
        .user-pfp {
            width: 80px;
            height:80px;
            border-radius:12px;
            box-shadow:0px 1px 2px rgba(0,0,0,0.20);
        }
        .user-info-name {
            font-weight:600;
            font-size:14px;
            padding-left:14px;
        }
        .review-info-title {
            display:flex;
            font-size:14px;
            font-weight:400;
            padding-left:14px;
        }
        .review-info-title input {
            flex:1;
            display:flex;
            border-width:0px;
            padding:14px;
            border-radius:12px;
            background-color:#FFFFFF;
        }
        .user-info-meta {
            flex:1;
            display:flex;
            flex-direction:column;
        }
        .user-info-meta-left {
            flex:1;
            display:flex;
            flex-direction:row;
            align-items:center;
            justify-content:space-between;
        }
        .review-info-rating {
            font-size:14px;
            font-weight:600;
            display:flex;
            flex-direction:row;
            align-items:center;
        }
        .review-info-rating svg {
            margin-top:-2px;
            margin-right:4px;
        }
        .review-info-rating input {
            display:flex;
            border-width:0px;
            padding:10px 10px;
            border-radius:12px;
            background-color:#F5F5F4;
        }
    }
    .reviewContent {
        display:flex;
        flex-direction:column;
    }
    .reviewContent div {
        font-size:14px;
        padding-top:20px;
    }
    .reviewContent textarea {
        flex:1;
        display:flex;
        border-width:0px;
        padding:14px;
        border-radius:12px;
        margin:20px 0px;
        resize:none;
        background-color:#FFFFFF;
    }
    .reviewActions {
        display:flex;
        flex-direction:row;
    }
    .reviewCancel {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        background-color: #000000;
        margin-top:20px;
        margin-right: 10px;
        cursor: pointer;
    }
    .reviewEdit {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        background-color: #000000;
        margin-top:20px;
        margin-right: 10px;
        cursor: pointer;
    }
    .reviewDelete {
        color: #FFFFFF;
        font-size: 12px;
        padding: 12px 30px;
        border-radius: 12px;
        background-color: #d13b53;
        margin-top:20px;
        margin-right: 10px;
        cursor: pointer;
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