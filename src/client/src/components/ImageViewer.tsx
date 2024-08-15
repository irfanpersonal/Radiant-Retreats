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
    console.log(data)

    let gridTemplateColumns;
  let gridTemplateRows;
  let gap = '20px';

  // Determine grid column and row templates based on number of images
  switch (data.length) {
    case 1:
      gridTemplateColumns = '100%';
      gridTemplateRows = 'auto';
      break;
    case 2:
      gridTemplateColumns = '60% 40%';
      gridTemplateRows = 'auto';
      break;
    case 3:
      gridTemplateColumns = '60% 40%';
      gridTemplateRows = 'auto auto';
      break;
    default:
      gridTemplateColumns = '100%';
      gridTemplateRows = 'auto';
      break;
  }

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: gridTemplateColumns,
    gridTemplateRows: gridTemplateRows,
    gap: gap,
    height: '300px', // Container level height
  };

  const imageStyles = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensure images fill their respective containers
  };

    
    return (
        
        <Wrapper>

            {(data.length > 0 && viewType === 'simple') && (
                <img src={data[0]} className="listingImageIco"/>
            )}

            
            
            {(data.length > 0 && viewType === 'advanced') && (
                // <div className="image-navigation">
                //     <div><FaArrowCircleLeft onClick={previousImage}/></div>
                //     <div className="right-arrow"><FaArrowCircleRight onClick={nextImage}/></div>
                // </div>
                <div className="main-container">
                {data.length === 1 && (
                    <div className="single-column">
                        <img src={data[0]} alt="Image 1" />
                    </div>
                )}
                {data.length === 2 && (
                    <div className="two-columns">
                        <div className="left-column">
                            <img src={data[0]} alt="Image 1" />
                        </div>
                        <div className="right-column">
                            <img src={data[1]} alt="Image 2" />
                        </div>
                    </div>
                )}
                {data.length === 3 && (
                    <div className="two-columns">
                        <div className="left-column">
                            <img src={data[0]} alt="Image 1" />
                        </div>
                        <div className="right-column">
                            <img src={data[1]} alt="Image 2" className="right-top" />
                            <img src={data[2]} alt="Image 3" className="right-bottom" />
                        </div>
                    </div>
                )}
                {data.length === 4 && (
                    <div className="two-columns">
                        <div className="left-column">
                            <img src={data[0]} alt="Image 1" />
                        </div>
                        <div className="right-column">
                            <div className="right-top">
                                <img src={data[1]} alt="Image 2"/>
                            </div>
                            <div className="right-bottom-two">
                                <div>
                                    <img src={data[2]} alt="Image 2"/>
                                </div>
                                <div>
                                    <img src={data[3]} alt="Image 2"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {data.length === 5 && (
                    <div className="two-columns">
                        <div className="left-column">
                            <img src={data[0]} alt="Image 1" />
                        </div>
                        <div className="right-column">
                            <div className="right-bottom-two">
                                <div>
                                    <img src={data[1]} alt="Image 2"/>
                                </div>
                                <div>
                                    <img src={data[2]} alt="Image 2"/>
                                </div>
                            </div>
                            <div className="right-bottom-two">
                                <div>
                                    <img src={data[3]} alt="Image 2"/>
                                </div>
                                <div>
                                    <img src={data[4]} alt="Image 2"/>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .listingImageIco {
        width:100%;
        height:200px;
        border-radius:0px;
    }

    .main-container {
        gap: 20px;
        display: flex;
        height: 480px;
        margin:40px 0px 60px 0px;
    }

    .single-column {
        flex: 1;
        height: 100%;
    }

    .single-column img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .two-columns {
        display: flex;
        width: 100%;
        height: 100%;
        gap: 20px;
    }

    .left-column {
        flex: 3;
        height: 100%;
    }

    .right-column {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: 20px;
        height: 100%;
    }

    .right-column img {
        width: 100%;
        object-fit: cover;
    }

    .right-top, .right-bottom {
        height: calc(50% - 10px); /* To account for the gap */
    }

    .right-bottom-two {
        gap:20px;
        display:flex;
        height: calc(50% - 10px); /* To account for the gap */
    }
    .right-bottom-two div {
        flex:1;
        display:flex;
        flex-direction:column;
    }

    img {
        width:100%;
        height:100%;
        object-fit:cover;
        border-radius: 20px; 
    }
    @media (max-width:1000px) {
        .main-container {
            height:300px;
        }
    }
    @media (max-width:768px) {
        .main-container {
            height:180px;
        }
    }
`;

export default ImageViewer;