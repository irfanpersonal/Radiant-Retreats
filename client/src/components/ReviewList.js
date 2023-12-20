import React from 'react';
import ReviewItem from "./ReviewItem";
import {nanoid} from 'nanoid';
import {FaPlusCircle} from "react-icons/fa";
import {CreateComment} from '../components';

const ReviewList = ({data, averageRating}) => {
    const [showCreateCommentBox, setShowCreateCommentBox] = React.useState(false);
    const toggleCommentBox = () => {
        setShowCreateCommentBox(currentState => {
            return !currentState;
        });
    }
    return (
        <section style={{border: '1px solid lightgray', borderRadius: '0.5rem', marginTop: '1rem', backgroundColor: 'white', padding: '1rem'}}>
            <h1 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', color: 'white', padding: '1rem', borderRadius: '0.25rem'}}>Reviews<FaPlusCircle onClick={toggleCommentBox} style={{fontSize: '1.5rem', cursor: 'pointer'}}/></h1>
            {showCreateCommentBox && (
                <CreateComment toggleCommentBox={toggleCommentBox}/>
            )}
            <h2 style={{textAlign: 'center', backgroundColor: 'rgb(249, 249, 249)', border: '1px solid gray', padding: '0.5rem', borderRadius: '0.25rem', margin: '1rem 0'}}>Average Rating: {averageRating}</h2>
            {data.map(item => (
                <ReviewItem key={nanoid()} data={item}/>
            ))}
        </section>
    );
}

export default ReviewList;
