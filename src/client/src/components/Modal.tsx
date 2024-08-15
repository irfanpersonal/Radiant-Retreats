import styled from 'styled-components';
import { IoMdClose } from "react-icons/io";

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
                        <div onClick={() => toggleModal()} className="icon"><IoMdClose size={'32px'}/></div>
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
    backdrop-filter: blur(15px); 
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
            width:600px;
            max-width:100%;
            padding:20px;
            border-radius:20px;
            background-color:#FFFFFF;
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                h3 {
                    font-size:24px;
                    font-weight:500;
                }
            }
            .modal-content {
                padding-top:20px;
            }
        }
    }
    @media (max-width:768px) {
        .modal-overlay .modal-container {
            margin:0px 30px;
        }
    }
`;

export default Modal;