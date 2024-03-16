import styled from 'styled-components';
import {FaWindowClose} from "react-icons/fa";

interface ModalProps {
    toggleModal: Function,
    title: string,
    children: React.ReactNode
}

const Modal: React.FunctionComponent<ModalProps> = ({toggleModal, title, children}) => {
    return (
        <Wrapper>
            <div className="modal-overlay">
                <div className="modal-container">
                    <div className="modal-header">
                        <h3>{title}</h3>
                        <div onClick={() => toggleModal()} className="icon"><FaWindowClose/></div>
                    </div>
                    <div className="modal-content">
                        {children}
                    </div>
                </div>
            </div>
        </Wrapper>  
    );
}

const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px); 
    .modal-overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon {
            cursor: pointer;
        }
        .icon:hover, .icon:active {
            color: red;
        }
        .modal-container {
            outline: 1px solid black;
            width: 50%;
            padding: 1rem;
            background-color: white;
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid black;
            }
            .modal-content {
                background-color: lightgray;
                margin-top: 0.5rem;
                padding: 0.25rem;
            }
        }
    }
`;

export default Modal;