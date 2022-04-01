import React from 'react';
import Button from "../button";
import Modal from "../modal";
import './index.css';

const ModalPercentRemoveLiquid = ({toggleModal, liquidPositionId, onRemoveLiquidPosition}) => {

  const onClick = (percent) => {
    return (e) => {
      e.preventDefault()
      onRemoveLiquidPosition(liquidPositionId, percent)
      toggleModal()
    }
  }

  return (
    <Modal toggleModal={toggleModal}>
      <div className="percent-remove-liquid">
        <Button onClick={onClick(0.25)}>25%</Button>
        <Button onClick={onClick(0.5)}>50%</Button>
        <Button onClick={onClick(0.75)}>75%</Button>
        <Button onClick={onClick(1)}>100%</Button>
      </div>
    </Modal>
  );
};

export default ModalPercentRemoveLiquid;
