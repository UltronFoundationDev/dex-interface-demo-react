import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import {currencyTokenInAddress} from "../../utils/currencyTokenInAddress";
import {setTokenForSwap} from "../../redux/reducers/tokens";
import ModalTokenList from "../modal-token-list";
import './index.css';

const Convert = ({value, onChange, setFocus, convertValue, currentValueName, currentConvertValueName, typeOpenModal, tokenAddress}) => {
  const dispatch = useDispatch()
  const [openModal, setOpenModal] = useState(false)
  const [balanceToken, setBalanceToken] = useState(0)

  const onFocus = () => setFocus(true)
  const onBlur = () => setFocus(false)

  const onOpenModal = () => {
    setOpenModal(p => !p)
  }

  const onChangeToken = (tokenId) => {
    dispatch(setTokenForSwap({tokenId, typeToken: typeOpenModal}))
    onOpenModal()
  }

  useEffect(() => {
    currencyTokenInAddress(tokenAddress, setBalanceToken)
  }, [tokenAddress])

  return (
    <div className='convert'>
      <div onClick={onOpenModal} className="convert__modal-token-list">
        {openModal ? <ModalTokenList toggleModal={onOpenModal} onChangeToken={onChangeToken} typeOpenModal={typeOpenModal}/> : <span>change token</span>}
      </div>
      <div className="convert__input">
        <label className="convert__input-label">
          <input value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} type="number"/>
          <span className="convert__input-label__value">
            1 {currentValueName} = {convertValue ? convertValue.toFixed(2) : 1} {currentConvertValueName}
          </span>
          <span className="convert__input-label__balance">
            {balanceToken} {currentValueName}
          </span>
        </label>
      </div>
    </div>
  );
};

export default Convert;
