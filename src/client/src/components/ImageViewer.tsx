import React from 'react';
import styled from 'styled-components';
import emptyPostImage from '../images/empty-post-image.jpeg';
import {FaArrowCircleLeft, FaArrowCircleRight} from "react-icons/fa";

interface ImageViewerProps {
    data: string[],
    // viewType is for controlling whether or not the user will be able to view the control options or not
    viewType: 'simple' | 'advanced',
    fullWidth: boolean
}

const ImageViewer: React.FunctionComponent<ImageViewerProps> = ({data, viewType, fullWidth}) => {
    const [currentImage, setCurrentImage] = React.useState(0);
    const previousImage = () => {
        setCurrentImage(currentState => {
            const newState = currentState - 1;
            if (newState === -1) {
                return data.length - 1;
            }
            return newState;
        })
    }
    const nextImage = () => {
        setCurrentImage(currentState => {
            const newState = currentState + 1;
            if (newState === data.length) {
                return 0;
            }
            return newState;
        });
    }
    return (
        <Wrapper>
            <img src={data[currentImage] || emptyPostImage} className={`${fullWidth && 'full-width'}`} alt='Listing Photo'/>
            {(data.length > 1 && viewType === 'advanced') && (
                <div className="image-navigation">
                    <div><FaArrowCircleLeft onClick={previousImage}/></div>
                    <div className="right-arrow"><FaArrowCircleRight onClick={nextImage}/></div>
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img {
        width: 10rem;
        height: 10rem;
        user-select: none;
        outline: 1px solid black;
    }
    .image-navigation {
        display: flex;
        margin-top: 0.5rem;
        svg {
            cursor: pointer;
            font-size: 1.5rem;
        }
        .right-arrow {
            margin-left: 0.5rem;
        }
    }
    .full-width {
        width: 100%;
        height: 15rem;
        max-height: 60vh;
        object-fit: fill;
        display: block;
    }
`;

export default ImageViewer;