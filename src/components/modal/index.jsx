import React from 'react';
import {close} from '../common/img';
import './index.css';

const Modal = ({toggleModal, children, ...props}) => {
  return (
    <div className='modal' {...props}>
      <div className="modal__inner">
        {children}
        <img onClick={toggleModal} src={close} alt="close" className="modal-close"/>
      </div>
    </div>
  );
};

export default Modal;
