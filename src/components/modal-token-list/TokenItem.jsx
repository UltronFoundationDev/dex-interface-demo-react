import React from 'react';

const TokenItem = ({name, onClick, id}) => {
  return (
    <div onClick={(e) => onClick(e, id)} className="token-item">
      {name}
    </div>
  );
};

export default TokenItem;
