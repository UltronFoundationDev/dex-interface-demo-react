import React from 'react';
import {useSelector} from "react-redux";
import Modal from "../modal";
import TokenItem from "./TokenItem";
import './index.css';

const tokensSelector = s => s.tokens;
const ModalTokenList = ({toggleModal, onChangeToken}) => {
  const {tokens} = useSelector(tokensSelector);

  const onClickTokenItem = (e, id) => {
    onChangeToken(id)
    toggleModal(e)
  }

  return (
    <Modal toggleModal={toggleModal}>
      <div className="token-list">
        <label className="token-list__search">
          <input type="text"/>
        </label>
        <div className="token-list__tokens">
          {tokens && !!tokens.length && tokens.map(i => <TokenItem key={i.id} name={i.name} id={i.id} onClick={onClickTokenItem}/>)}
        </div>
      </div>
    </Modal>
  );
};

export default ModalTokenList;
