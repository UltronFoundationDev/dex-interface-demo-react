import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Button from "../../components/button";
import Convert from "../../components/convert";
import ModalApprove from "../../components/modal-approve";
import ModalDescription from "../../components/modal-description";
import {useSwap} from "../../hooks/useSwap";
import {onFixedValue} from "../../utils/changeLengthValue";
import {toFixed} from "../../utils/fixedValue";

const tokensSelector = s => s.tokens;
const onChange = (e, func) => {
  func(e.target.value)
  // if (/[0-9]/.test(+e.target.value)) func(+e.target.value)
  // else alert('Не правильный ввод')
}

const Swap = () => {
  const dispatch = useDispatch()
  const {tokenMe, tokenGet} = useSelector(tokensSelector);

  const [slippage, setSlippage] = useState('0.8')
  const [fee, setFee] = useState(0.025)
  const [priceImpact, setPriceImpact] = useState(0)

  const [openModalApproveSwap, setOpenModalApproveSwap] = useState(false)
  const [openModalDescription, setOpenModalDescription] = useState(false)

  const [isTransFailed, setIsTransFailed] = useState(null)
  const [transData, setTransData] = useState(null)

  const [priceToken2OnToken1, setPriceToken2OnToken1] = useState(0)
  const [priceToken1OnToken2, setPriceToken1OnToken2] = useState(0)

  const [priceOneToOneToken1, setPriceOneToOneToken1] = useState(0)
  const [priceOneToOneToken2, setPriceOneToOneToken2] = useState(0)

  const [meFocus, setMeFocus] = useState(false)
  const [getFocus, setGetFocus] = useState(false)

  const onChangeToken2OnToken1 = (e) => onChange(e, setPriceToken2OnToken1)
  const onChangeToken1OnToken2 = (e) => onChange(e, setPriceToken1OnToken2)
  const onChangeSlippage = (e) => onChange(e, setSlippage)

  useEffect(() => {
    if (tokenGet && tokenMe) {
      getAmountIn(priceToken2OnToken1, [tokenGet.address, tokenMe.address], setPriceToken2OnToken1)
      getAmountOut(priceToken1OnToken2, [tokenGet.address, tokenMe.address], setPriceToken1OnToken2)
      getAmountOut(1, [tokenGet.address, tokenMe.address], setPriceOneToOneToken1)
      getAmountIn(1, [tokenGet.address, tokenMe.address], setPriceOneToOneToken2)
    }
  }, [tokenGet, tokenMe])

  useEffect(() => {
    if (meFocus) {
      getAmountOut(priceToken2OnToken1, [tokenGet.address, tokenMe.address], setPriceToken1OnToken2)
    }
  }, [meFocus, priceToken2OnToken1, tokenMe])

  useEffect(() => {
    if (getFocus) {
      getAmountIn(priceToken1OnToken2, [tokenGet.address, tokenMe.address], setPriceToken2OnToken1)
    }
  }, [getFocus, priceToken1OnToken2, tokenGet])

  useEffect(() => {
    if (priceToken1OnToken2) {
      getPriceImpact(priceToken1OnToken2, [tokenMe.address, tokenGet.address], setPriceImpact)
    }
  }, [priceToken1OnToken2])

  const onOpenModalApproveSwap = (e) => {
    e.preventDefault()
    setOpenModalApproveSwap(p => !p)
  }

  const onOpenModalDescription = (e) => {
    e.preventDefault()
    setOpenModalDescription(p => !p)
  }

  const {onSwap, getAmountOut, getAmountIn, getPriceImpact} = useSwap()

  return (
    <div>
      <Convert value={priceToken2OnToken1} onChange={onChangeToken2OnToken1} setFocus={setMeFocus} currentValueName={tokenMe.name}
               currentConvertValueName={tokenGet.name} convertValue={priceOneToOneToken1}
               typeOpenModal={1} tokenAddress={tokenMe.address}/>

      {/*<img onClick={onReversalValues} className='circle-arrow' src={circleArrow} alt="circle-arrow"/>*/}

      <Convert value={priceToken1OnToken2} onChange={onChangeToken1OnToken2} setFocus={setGetFocus} currentValueName={tokenGet.name}
               currentConvertValueName={tokenMe.name} convertValue={priceOneToOneToken2}
               typeOpenModal={2} tokenAddress={tokenGet.address}/>

      <div className="swap__info-swapping">
        <div className="swap__info-swapping__slippage">
          Slippage:
          <input value={slippage} onChange={onChangeSlippage}/>
        </div>
        <div className="swap__info-swapping__minimum-received">
          Minimum Received: <span>{toFixed(priceToken1OnToken2 * (1 - (+slippage / 100)), 6)}</span>
        </div>
        <div className="swap__info-swapping__price-impact">
          Price Impact: <span>{toFixed(priceImpact)}</span>
        </div>
        <div className="swap__info-swapping__fee">
          Fee: <span>{fee}%</span>
        </div>
      </div>


      <div className="app__swap-btn">
        <Button onClick={onOpenModalApproveSwap}>Swap</Button>
      </div>

      {openModalApproveSwap && <ModalApprove onApprove={onSwap} onOpenModalDescription={onOpenModalDescription}
                                             setIsTransFailed={setIsTransFailed} setTransData={setTransData}
                                             toggleModal={onOpenModalApproveSwap}
                                             priceOnoToOneToken={priceOneToOneToken2}
                                             getToken={tokenGet} getTokenValue={priceToken1OnToken2}
                                             meToken={tokenMe} meTokenValue={priceToken2OnToken1}/>}

      {openModalDescription && <ModalDescription transData={transData} toggleModal={onOpenModalDescription}
                                                 isTransFailed={isTransFailed}/>}

    </div>
  );
};

export default Swap;
