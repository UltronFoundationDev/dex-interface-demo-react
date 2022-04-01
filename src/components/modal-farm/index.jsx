import React, {memo, useState} from 'react';
import Button from "../button";
import Modal from "../modal";
import './index.css';

const ModalFarm = ({toggleModal, tokens, onDeposit, onWithdraw}) => {
  const [depositValue, setDepositValue] = useState('')
  const [withdrawValue, setWithdrawValue] = useState('')

  const onChange = (e, f) => f(e.target.value);
  const onChangeDeposit = e => onChange(e, setDepositValue)
  const onChangeWithdraw = e => onChange(e, setWithdrawValue)

  const onClickDeposit =  () => {
    onDeposit(depositValue, tokens)
  }

  const onClickWithdraw =  () => {
    onWithdraw(withdrawValue, tokens)
  }

  return (
    <Modal toggleModal={toggleModal}>
      <div className="modal-farm">
        <div className="modal-farm__block">
          <label className="modal-farm__input">
            <input type="text" value={depositValue} onChange={onChangeDeposit}/>
          </label>
          <div className="modal-farm__btn">
            <Button onClick={onClickDeposit}>Deposit</Button>
          </div>
        </div>
        <div className="modal-farm__block">
          <label className="modal-farm__input">
            <input type="text" value={withdrawValue} onChange={onChangeWithdraw}/>
          </label>
          <div className="modal-farm__btn">
            <Button onClick={onClickWithdraw}>Withdraw</Button>
          </div>
        </div>


      </div>
    </Modal>
  );
};

export default memo(ModalFarm);
