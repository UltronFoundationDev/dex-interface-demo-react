import React, {memo} from 'react';
import {toFixed} from "../../utils/fixedValue";
import Button from "../button";
import Modal from "../modal";
import './index.css';

const ModalApprove = ({toggleModal, onOpenModalDescription, setTransData, setIsTransFailed, meToken, getToken, priceOnoToOneToken, meTokenValue, getTokenValue, onApprove}) => {

  const onClick = async (e) => {
    try {
      setTransData(await onApprove({...meToken, value: meTokenValue}, {...getToken, value: getTokenValue}))
      setIsTransFailed(false)
      toggleModal(e)
      onOpenModalDescription(e)
    } catch (err) {
      console.log(err)
      setIsTransFailed(true)
      toggleModal(e)
      onOpenModalDescription(e)
    }
  }

  return (
    <Modal toggleModal={toggleModal}>
      <div className="approve-swap">
        <div className="approve-swap__exchange-token">
          {meTokenValue} {meToken.name}
        </div>
        <div className="approve-swap__exchange-token">
          {getTokenValue} {getToken.name}
        </div>
        <div className="approve-swap__token-price">
          1 {meToken.name} = {toFixed(priceOnoToOneToken)} {getToken.name}
        </div>
        <div className="approve-swap__token-btn">
          <Button onClick={onClick}>Approve</Button>
        </div>
      </div>
    </Modal>
  );
};

export default memo(ModalApprove);
