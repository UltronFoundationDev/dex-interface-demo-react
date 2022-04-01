import React from 'react';
import {ethers} from 'ethers';
import './index.css';

const WalletConnect = ({setIsWalletConnect}) => {
  const onWalletConnect = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', []);
      setIsWalletConnect(true)
    } else {
      setIsWalletConnect(false)
      alert('Install metamask')
    }
  }

  return (
    <div className='wallet-connect'>
      <h3 onClick={onWalletConnect} className='wallet-connect__title'>Connect Metamask</h3>
    </div>
  );
};

export default WalletConnect;
