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
        <Wrapper>
            <form onSubmit={handleSubmit}>
                <div className="title">Apply for Host</div>
                <div>
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input id="phoneNumber" type="tel" name="phoneNumber" required/>
                </div>
                <p className="file-input-info">Maximum file size of 2MB</p>
                <div>
                    <label htmlFor="governmentIssuedID">Government Issued ID (Image)</label>
                    <input id="governmentIssuedID" type="file" name="governmentIssuedID" required/>
                </div>
                <div>
                    <label htmlFor="backgroundCheck">Background Check (Image)</label>
                    <input id="backgroundCheck" type="file" name="backgroundCheck" required/>
                </div>
                <p className="file-input-info">Note: After submitting a host request, you will not be able to make any edits. Therefore, please ensure that all information is entered correctly before submission.</p>
                <Link to='/profile'><button type="button">Cancel</button></Link>
                <button type="submit" disabled={createHostRequestLoading}>{createHostRequestLoading ? 'Creating Host Request' : 'Create Host Request'}</button>
            </form>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    form {
        width: 50%;
        outline: 1px solid black;
        padding: 1rem;
        .title {
            text-align: center;
            border-bottom: 1px solid black;
        }
        .file-input-info {
            background-color: lightgray;
            margin-top: 1rem;
            padding: 0.25rem;
            outline: 1px solid black;
        }
        label {
            display: block;
            margin-top: 0.5rem;
            text-decoration: underline;
        }
        input, button {
            width: 100%;
            padding: 0.25rem;
        }
        input[type="file"] {
            padding: 0;
        }
        button {
            margin-top: 1rem;
        }
    }
`;

export default ApplyForHost;