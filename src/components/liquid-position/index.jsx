import React, {useLayoutEffect, useState} from 'react';
import ModalPercentRemoveLiquid from "../modal-percent-remove-liquid";

const LiquidPosition = ({id, tokens, onDropLiquidity, getLPTokenBalance, getTokenBalance}) => {
  const [showModal, setShowModal] = useState(false)
  const [LPTokenBalance, setLPTokenBalance] = useState(0)
  const [token1Balance, setToken1Balance] = useState(0)
  const [token2Balance, setToken2Balance] = useState(0)
  const [percentMyLPTokenRelationTotal, setPercentMyLPTokenRelationTotal] = useState(0)

  useLayoutEffect(() => {
    getLPTokenBalance(tokens, setLPTokenBalance)
    getTokenBalance(tokens, setToken1Balance, setToken2Balance, setPercentMyLPTokenRelationTotal)
  }, [])

  const toggleModal = () => setShowModal(p => !p)

  return (
    <div className="liquid-position">
      <div className="liquid-position__id">id: {id}</div>
      <div className="liquid-position__nonce">Token {tokens[0].name}: {token1Balance}</div>
      <div className="liquid-position__nonce">Token {tokens[1].name}: {token2Balance}</div>
      <div className="liquid-position__nonce">LPTokenBalance: {LPTokenBalance.toFixed(6)}</div>
      <div className="liquid-position__nonce">My percent LPToken: {percentMyLPTokenRelationTotal.toFixed(2)}%</div>
      <div onClick={toggleModal} className="liquid-position__drop">drop</div>

      {showModal && <ModalPercentRemoveLiquid toggleModal={toggleModal} liquidPositionId={id} onRemoveLiquidPosition={onDropLiquidity}/>}
    </div>
  );
};

export default LiquidPosition;
