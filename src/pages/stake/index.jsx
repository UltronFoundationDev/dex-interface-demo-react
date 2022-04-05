import React, {useLayoutEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import FarmPosition from "../../components/farm-position";
import ModalFarm from "../../components/modal-farm";
import {useStake} from "../../hooks/useStake";
import {setLiquidPosition} from "../../redux/reducers/liquidPosition";
import './index.css';

const liquidPositionSelector = s => s.liquidPosition;

const Stake = () => {
  const dispatch = useDispatch()
  const liquidPositions = useSelector(liquidPositionSelector);

  const [openModalFarm, setOpenModalFarm] = useState(false)
  const [selectTokens, setSelectTokens] = useState(null)

  const onOpenModalFarm = (e) => {
    e.preventDefault()
    setOpenModalFarm(p => !p)
  }

  const {onDeposit, onWithdraw, onHarvest} = useStake()

  const onNewLiquidityPosition = (data) => {
    dispatch(setLiquidPosition(data))
  }

  useLayoutEffect(() => {
    const liquidPositions = JSON.parse(localStorage.getItem('liquid-position'))
    if (liquidPositions) onNewLiquidityPosition(liquidPositions)
  }, [])


  return (
    <div className='farm'>
      {liquidPositions && !!liquidPositions.length &&
      liquidPositions.map(i => <FarmPosition key={i.id} tokens={i.tokens} toggleModal={onOpenModalFarm} onHarvest={onHarvest} onSelectTokens={setSelectTokens}/>)}

      {openModalFarm && <ModalFarm toggleModal={onOpenModalFarm} tokens={selectTokens} onDeposit={onDeposit} onWithdraw={onWithdraw}/>}
    </div>
  );
};

export default Stake;
