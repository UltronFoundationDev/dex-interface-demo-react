import React from 'react';
import './index.css';

const Button = ({className, children, ...props}) => {
  return (
    <button className={`${className ?? ''} custom-button`} {...props}>
      {children}
    </button>
  );
};

export default Button;
