import React from 'react';
import Button from "../button";
import './index.css';

const FarmPosition = ({toggleModal, tokens, onSelectTokens, onHarvest}) => {
  const onClick = (e) => {
    toggleModal(e)
    onSelectTokens(tokens)
  }
  return (
    <div className="farm-position">
      <div className="farm-position__tokens">
        {tokens[0].name} - {tokens[1].name}
      </div>
      <div className="farm-position__liquid">
        100 000$
      </div>
      <div className="farm-position__earn">
        -
      </div>
      <div className="farm-position__btn">
        <Button onClick={onHarvest}>Harvest</Button>
        <Button onClick={onClick}>Farm</Button>
      </div>
    </div>
  );
};

export default FarmPosition;
