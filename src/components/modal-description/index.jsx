import React, {memo, useState} from 'react';
import Button from "../button";
import Modal from "../modal";
import './index.css';


const ModalDescription = ({transData, toggleModal, isTransFailed}) => {
  return (
    <Modal toggleModal={toggleModal}>
      <div className="modal-description">
        <div className="modal-description__description">
          {isTransFailed ? <TransactionFailed/> : <TransactionSuccess transData={transData}/>}
        </div>

        <div className="modal-description__token-btn">
          <Button onClick={toggleModal}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default (ModalDescription);

const TransactionFailed = () => {
  return <div className="transaction-failed">
    The transaction failed due to something...
  </div>
}

const TransactionSuccess = ({transData}) => {
  return <div className="transaction-success">
    <div className="transaction-success__title">
      The transaction was successfully
    </div>
    <div className="transaction-success__trans">
      <a href={`https://testnet.bscscan.com/tx/${transData?.hash}`}>{transData?.hash}</a>
    </div>
  </div>
}
