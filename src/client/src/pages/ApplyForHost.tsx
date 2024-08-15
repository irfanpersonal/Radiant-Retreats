import React from 'react';
import styled from 'styled-components';
import {useDispatch, useSelector} from 'react-redux';
import {type useDispatchType, type useSelectorType} from '../store';
import {createHostRequest} from '../features/hostRequest/hostRequestThunk';
import {Link, useNavigate} from 'react-router-dom';

const ApplyForHost: React.FunctionComponent = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<useDispatchType>();
    const {user} = useSelector((store: useSelectorType) => store.user);
    const {createHostRequestLoading} = useSelector((store: useSelectorType) => store.hostRequest);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const target = event.target as HTMLFormElement;
        const formData = new FormData();
        formData.append('phoneNumber', (target.elements.namedItem('phoneNumber') as HTMLInputElement).value);
        formData.append('governmentIssuedID', (target.elements.namedItem('governmentIssuedID') as HTMLInputElement).files![0]);
        formData.append('backgroundCheck', (target.elements.namedItem('backgroundCheck') as HTMLInputElement).files![0]);
        dispatch(createHostRequest(formData));
    }
    React.useEffect(() => {
        if (user!.hostRequest) {
            navigate('/profile'); 
        }
    }, []);
    return (
        <Wrapper className="containerMin">
            <form onSubmit={handleSubmit}>
                <h1 className="title">Apply for Host</h1>
                <div className="comboBox">
                    <div>
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input id="phoneNumber" type="tel" name="phoneNumber" required/>
                    </div>
                </div>
                
                <div className="comboBox">
                    <div>
                        <label htmlFor="governmentIssuedID">Government Issued ID (Image: Max 2mb)</label>
                        <input id="governmentIssuedID" type="file" name="governmentIssuedID" required/>
                    </div>
                </div>
                <div className="comboBox">
                    <div>
                        <label htmlFor="backgroundCheck">Background Check (Image: Max 2mb)</label>
                        <input id="backgroundCheck" type="file" name="backgroundCheck" required/>
                    </div>
                </div>
                
                <p className="file-input-info">Note: After submitting a host request, you will not be able to make any edits. Therefore, please ensure that all information is entered correctly before submission.</p>
                
                <div className="actionRow">
                    <button type="submit" disabled={createHostRequestLoading}>{createHostRequestLoading ? 'Creating Host Request' : 'Create Host Request'}</button>
                    <Link to='/profile'><button type="button">Cancel</button></Link>
                </div>
                
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    form {
        padding: 12px;
        margin-top:50px;
        margin-bottom:50px;
        border-radius: 20px;
        background-color: #F5F5F4;
        border: 1px solid rgba(17, 17, 17, 0.04);
        h1 {
            padding:12px;
            font-size:24px;
            font-weight:500;
        }
    }
    .comboBox {
        display:flex;
        flex-direction:row;
        div {
            flex:1;
            padding:12px;
            display:flex;
            flex-direction:column;
        }
        .amenity-input-container {
            padding:0px;
            margin:10px 0px;
            flex-direction:row;
            button {
                cursor:pointer;
                color:#FFFFFF;
                border-width:0px;
                padding:0px 20px;
                margin-left:20px;
                border-radius:12px;
                background-color:#000000;
            }
        }
        label {
            color: #717171;
            font-size: 12px;
            margin-bottom: 10px;
        }
        input , select {
            flex: 1;
            display: flex;
            font-size: 14px;
            border-width: 0px;
            border-radius: 12px;
            background-color: #FFFFFF;
            padding: 14px 14px 14px 14px;
        }
        textarea {
            flex: 1;
            display: flex;
            font-size: 14px;
            border-width: 0px;
            border-radius: 12px;
            background-color: #FFFFFF;
            padding: 14px 14px 14px 14px;
        }
        .createListingAction {
            flex-direction:row;
            button {
                height: 48px;
                color: #FFFFFF;
                font-weight: 500;
                border-radius: 12px;
                background-color: #2d814e;
                border-width: 0px;
                margin-bottom: 0px;
                cursor:pointer;
                padding:0px 60px;
            }
            .cancelEdit {
                margin-left:20px;
                background-color:#d13b53;
            }
        }
    }
    .file-input-info {
        margin:0px;
        padding:10px;
        font-size:14px;
        color:#717171;
    }
    .actionRow {
        padding:10px;
        button {
            height: 48px;
            color: #FFFFFF;
            font-weight: 500;
            border-radius: 12px;
            border-width: 0px;
            padding:0px 40px;
            background-color: #2d814e;
            cursor:pointer;
        }
        a button {
            height: 48px;
            color: #FFFFFF;
            font-weight: 500;
            border-width: 0px;
            border-radius: 12px;
            margin-left:20px;
            background-color: #d13b53;
        }
    }
    @media (max-width:768px) {
        .userAction.alternateColor {
            margin-right:0px !important;
        }
        form {
            margin-top:0px;
            margin-bottom:0px;
            border-radius:0px;
        }
    }
`;

export default ApplyForHost;