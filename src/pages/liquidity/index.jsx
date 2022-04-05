import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../components/button';
import Convert from '../../components/convert';
import LiquidPosition from '../../components/liquid-position';
import ModalApprove from '../../components/modal-approve';
import ModalDescription from '../../components/modal-description';
import {useLiquidity} from '../../hooks/useLiquidity';
import {useSwap} from '../../hooks/useSwap';
import {setLiquidPosition} from '../../redux/reducers/liquidPosition';

const tokensSelector = s => s.tokens;
const liquidPositionSelector = s => s.liquidPosition;

const onChange = (e, func) => func(e.target.value)

const Liquidity = () => {
  const dispatch = useDispatch()
  const {tokenMe, tokenGet} = useSelector(tokensSelector);
  const liquidPosition = useSelector(liquidPositionSelector);

  const [openModalApprove, setOpenModalApprove] = useState(false)
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


  const onOpenModalApprove = (e) => {
    e.preventDefault()
    setOpenModalApprove(p => !p)
  }

  const onOpenModalDescription = (e) => {
    e.preventDefault()
    setOpenModalDescription(p => !p)
  }

  const onNewLiquidityPosition = (data) => {
    dispatch(setLiquidPosition(data))
  }

  const {onLiquidity, onDropLiquidity, getLPTokenBalance, getTokenBalance} = useLiquidity(onNewLiquidityPosition)
  const {getAmountOut, getAmountIn} = useSwap()

  useLayoutEffect(() => {
    const liquidPositions = JSON.parse(localStorage.getItem('liquid-position'))
    if (liquidPositions) onNewLiquidityPosition(liquidPositions)
  }, [])

  return (
    <div>
      <Convert value={priceToken2OnToken1} onChange={onChangeToken2OnToken1} setFocus={setMeFocus} currentValueName={tokenMe.name}
               currentConvertValueName={tokenGet.name} convertValue={priceOneToOneToken1}
               typeOpenModal={1} tokenAddress={tokenMe.address}/>

      {/*<img onClick={onReversalValues} className='circle-arrow' src={circleArrow} alt='circle-arrow'/>*/}

      <Convert value={priceToken1OnToken2} onChange={onChangeToken1OnToken2} setFocus={setGetFocus} currentValueName={tokenGet.name}
               currentConvertValueName={tokenMe.name} convertValue={priceOneToOneToken2}
               typeOpenModal={2} tokenAddress={tokenGet.address}/>

      <div className='app__swap-btn'>
        <Button onClick={onOpenModalApprove}>Add Liquidity</Button>
      </div>

      {openModalApprove && <ModalApprove onApprove={onLiquidity} toggleModal={onOpenModalApprove}
                                         setIsTransFailed={setIsTransFailed} onOpenModalDescription={onOpenModalDescription}
                                         setTransData={setTransData}
                                         priceOnoToOneToken={priceOneToOneToken2}
                                         getToken={tokenGet} getTokenValue={priceToken1OnToken2}
                                         meToken={tokenMe} meTokenValue={priceToken2OnToken1}/>}

      {openModalDescription && <ModalDescription transData={transData} toggleModal={onOpenModalDescription} isTransFailed={isTransFailed}/>}


      <div className='my-position'>
        <h3>My positions</h3>

        <div className='my-position__lists'>
          {liquidPosition && !!liquidPosition.length
            ? liquidPosition.map(i => <LiquidPosition key={i.id} id={i.id} hash={i.hash} tokens={i.tokens}
                                                      onDropLiquidity={onDropLiquidity}
                                                      getTokenBalance={getTokenBalance} getLPTokenBalance={getLPTokenBalance}/>)
            : 'you no have liquid positions'}
        </div>

      </div>

    </div>
  );
};

export default Liquidity;
