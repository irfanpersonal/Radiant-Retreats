import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useDispatchType, useSelectorType } from '../store';
import { Loading, ListingSearchBox, ListingList } from '../components';
import { resetSearchBoxValues, updateSearchBoxValues, setPage } from '../features/listing/listingSlice';
import { getAllListings } from '../features/listing/listingThunk';
import { CiFilter, CiGrid41, CiGrid2H } from "react-icons/ci";
import { ViewType } from '../components/ListingList';
import { countries } from '../utils'; // Importing countries array

const Listing: React.FunctionComponent = () => {
    const dispatch = useDispatch<useDispatchType>();
    const { getAllListingsLoading, listings, totalListings, numberOfPages, page, searchBoxValues } = useSelector((store: useSelectorType) => store.listing);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [viewType, setViewType] = useState<ViewType>('grid');
    const [bedrooms, setBedrooms] = useState<number>(1); 
    const [bathrooms, setBathrooms] = useState<number>(1);
    const filterPanelRef = useRef<HTMLDivElement>(null);
    const listingFilterRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        dispatch(getAllListings());
    }, [dispatch]);
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                filterPanelRef.current &&
                !filterPanelRef.current.contains(event.target as Node) &&
                listingFilterRef.current &&
                !listingFilterRef.current.contains(event.target as Node)
            ) {
                setIsFilterVisible(false);
            }
        };

        if (isFilterVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isFilterVisible]);

    const toggleFilter = () => {
        setIsFilterVisible(prev => !prev); // Toggle filter visibility
    };

    // Function to update search box values for dropdown and numerate inputs
    const handleInputChange = (name: string, value: string) => {
        dispatch(updateSearchBoxValues({ name, value }));
        if (name === 'country' || name === 'bathsAmount') {
            dispatch(getAllListings()); // Trigger getAllListings on country or bathsAmount change
        }
    };

    // Function to handle incrementing bedrooms
    const incrementBedrooms = () => {
        dispatch(setPage(1))
        setBedrooms(prev => prev + 1);
        dispatch(updateSearchBoxValues({ name: 'bedroomsAmount', value: (bedrooms + 1).toString() }));
        dispatch(getAllListings()); // Trigger getAllListings after updating bedrooms
    };

    // Function to handle decrementing bedrooms
    const decrementBedrooms = () => {
        if (bedrooms > 1) {
            dispatch(setPage(1))
            setBedrooms(prev => prev - 1);
            dispatch(updateSearchBoxValues({ name: 'bedroomsAmount', value: (bedrooms - 1).toString() }));
            dispatch(getAllListings()); // Trigger getAllListings after updating bedrooms
        }
    };

    // Function to handle incrementing bathrooms
    const incrementBathrooms = () => {
        dispatch(setPage(1))
        setBathrooms(prev => prev + 1);
        dispatch(updateSearchBoxValues({ name: 'bathsAmount', value: (bathrooms + 1).toString() }));
        dispatch(getAllListings()); // Trigger getAllListings after updating bathrooms
    };

    // Function to handle decrementing bathrooms
    const decrementBathrooms = () => {
        if (bathrooms > 1) {
            dispatch(setPage(1))
            setBathrooms(prev => prev - 1);
            dispatch(updateSearchBoxValues({ name: 'bathsAmount', value: (bathrooms - 1).toString() }));
            dispatch(getAllListings()); // Trigger getAllListings after updating bathrooms
        }
    };

    return (
        <Wrapper>
            <div className="listingBar">
                <div className="listingType">
                    <div ref={listingFilterRef} className={`listingTypeItem ${viewType === 'grid' ? 'active' : ''}`} onClick={() => setViewType('grid')}>
                        <CiGrid41 size={'20px'} color={'#717171'} />
                    </div>
                    <div className={`listingTypeItem ${viewType === 'list' ? 'active' : ''}`} onClick={() => setViewType('list')}>
                        <CiGrid2H size={'20px'} color={'#717171'} />
                    </div>
                </div>
                <div className="listingOptions">
                    <select className="dropdown" value={searchBoxValues.country} onChange={(e) => {
                        dispatch(setPage(1));
                        handleInputChange('country', e.target.value);
                    }}>
                        <option value="">Anywhere</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>

                    <div className="numerateInput spaceHorizontal">
                        <div className="numerateMinus" onClick={decrementBedrooms}></div>
                        <div className="numerateLabel"><span>{bedrooms}</span> {bedrooms === 1 ? 'Bed' : 'Beds'}</div>
                        <div className="numeratePlus" onClick={incrementBedrooms}></div>
                    </div>

                    <div className="numerateInput">
                        <div className="numerateMinus" onClick={decrementBathrooms}></div>
                        <div className="numerateLabel"><span>{bathrooms}</span> {bathrooms === 1 ? 'Bath' : 'Baths'}</div>
                        <div className="numeratePlus" onClick={incrementBathrooms}></div>
                    </div>
                </div>
                <div ref={listingFilterRef} className={`listingFilter ${isFilterVisible && 'border-green'}`} onClick={toggleFilter}>
                    <CiFilter size={'20px'} color={`#717171`}/>
                </div>
            </div>
            <div className="mainContainer">
                <div ref={filterPanelRef} className={`filterPanel ${isFilterVisible ? 'visible' : ''}`}>
                    <ListingSearchBox
                        resetSearchBoxValues={resetSearchBoxValues}
                        updateSearchBoxValues={updateSearchBoxValues}
                        updateSearch={getAllListings} // Pass getAllListings function to updateSearch prop
                        searchBoxValues={searchBoxValues}
                    />
                </div>
                <div className="mainBody">
                    {getAllListingsLoading ? (
                        <Loading title="Loading All Listings" position='normal' />
                    ) : (
                        <ListingList
                            data={listings}
                            numberOfPages={numberOfPages as number}
                            page={page as number}
                            totalListings={totalListings as number}
                            changePage={setPage}
                            updateSearch={getAllListings}
                            viewType={viewType}
                            setViewType={setViewType}
                        />
                    )}
                </div>
            </div>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    .listingBar {
        display:flex;
        flex-direction:row;
        align-items:center;
        padding:11.5px 30px;
        justify-content:space-between;
        border-bottom:1px solid #e7e7e7;
    }
    .listingType {
        padding:3px;
        display:flex;
        flex-direction:row;
        border-radius:12px;
        background-color:#F3F3F2;
    }
    .listingTypeItem {
        cursor: pointer;
        width:34px;
        height:34px;
        margin:3px;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .listingTypeItem.active {
        border-radius:8px;
        background-color:#000000;
    }
    .listingTypeItem.active svg {
        color:#FFFFFF !important;
    }
    .listingOptions {
        display:flex;
        flex-direction:row;
    }
    .listingFilter {
        cursor: pointer;
        width:48px;
        height:48px;
        border-radius:8px;
        display:flex;
        align-items:center;
        justify-content:center;
        background-color:#F3F3F2;
    }
    .dropdown {
        width:240px;
        height:48px;
        padding:0px 15px;
        color:#111111;
        font-size: 14px;
        display:flex;
        flex-direction:row;
        align-items:center;
        border-radius:12px;
        border-width:0px;
        background-color:#F3F3F2;
        justify-content:space-between;
    }
    .dropdownLabel {
        flex:1;
        display:flex;
        color:#111111;
        font-size: 14px;
    }
    .dropdownIco {
        width:12px;
        height:12px;
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .dropdownIco::before {
        width:1px;
        height:7px;
        content:'';
        margin-right:4px;
        position:absolute;
        background-color:#717171;
        transform:rotate(-45deg);
    }
    .dropdownIco::after {
        width:1px;
        height:7px;
        content:'';
        margin-left:4px;
        position:absolute;
        background-color:#717171;
        transform:rotate(45deg);
    }
    .numerateInput {
        height:48px;
        display:flex;
        flex-direction:row;
        align-items:center;
        border-radius:12px;
        padding:0px 10px;
        background-color:#F3F3F2;
    }
    .numerateLabel {
        color:#111111;
        font-size:14px;
        margin:0px 15px;
    }
    .numeratePlus {
        cursor: pointer;
        width:32px;
        height:32px;
        display:flex;
        border-radius:8px;
        position:relative;
        align-items:center;
        justify-content:center;
        background-color:#FFFFFF;
    }
    .numeratePlus::before {
        content:'';
        width:10px;
        height:1.5px;
        position:absolute;
        background-color:#2d814e;
    }
    .numeratePlus::after {
        content:'';
        width:10px;
        height:1.5px;
        position:absolute;
        transform:rotate(90deg);
        background-color:#2d814e;
    }
    .numerateMinus {
        cursor: pointer;
        width:32px;
        height:32px;
        display:flex;
        border-radius:8px;
        position:relative;
        align-items:center;
        justify-content:center;
        background-color:#FFFFFF;
    }
    .numerateMinus::before {
        width:10px;
        height:1.5px;
        content:'';
        background-color:#2d814e;
    }
    .spaceHorizontal {
        margin:0px 12px;
    }
    .filterPanel {
        position: fixed;
        top: 144px;
        right: -300px; /* Change this value to the width of your panel */
        width: 300px;
        height: calc(100vh - 144px);
        overflow-y:auto;
        background: #fff;
        box-shadow: -2px 0 5px rgba(0,0,0,0.1);
        transition: right 0.3s ease-in-out;
        z-index: 1000;
    }
    .filterPanel.visible {
        right: 0;
    }
    .mainBody {
        overflow-y:auto;
        height:calc(100vh - 144px);
    }
    @media (max-width:768px) {
        .listingOptions {
            display:none;
        }
    }
    .border-green {
        border: 1px solid green;
    }
`;

export default Listing;