import React from 'react';
import noListingPhoto from '../images/no-listing-photo.jpeg';
import {FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";

const ListImage = ({data}) => {
    const [currentImage, setCurrentImage] = React.useState(0);
    const previousImage = () => {
        setCurrentImage(currentState => {
            if (currentState === 0) {
                return data.length - 1;
            }
            return currentState - 1;
        });
    }
    const nextImage = () => {
        setCurrentImage(currentState => {
            if (currentState === data.length - 1) {
                return 0;
            }
            return currentState + 1;
        });
    }
    return (
        <div style={{position: 'relative'}}>
            <FaArrowAltCircleLeft onClick={previousImage} title="Previous Image" className="left-btn"/>
            <FaArrowAltCircleRight onClick={nextImage} title="Next Image" className="right-btn"/>
            <img src={data[currentImage] || noListingPhoto}/>
        </div>
    );
}

export default ListImage;