import React, {useLayoutEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Routes, Route, Link} from 'react-router-dom';
import WalletConnect from "./components/wallet-connect";
import Farm from "./pages/farm";
import Liquidity from "./pages/liquidity";
import Stake from "./pages/stake";
import Swap from "./pages/swap";
import {checkConnectWallet} from "./utils/checkConnectWallet";
import loaderImg from './components/common/img/loader.gif'

const loaderSelector = s => s.loader;

function App() {
  const loader = useSelector(loaderSelector)
  const [isWalletConnect, setIsWalletConnect] = useState(false)

  useLayoutEffect(() => {
    checkConnectWallet()
  }, [])

  return (
    <div className="app">
      <header className='header'>
        <menu className='header-menu'>
          <Link to='/'>Swap</Link>
          <Link to='/liquidity'>Liquidity</Link>
          <Link to='/farm'>Farm</Link>
          <Link to='/stake'>Stake</Link>
        </menu>
        <WalletConnect setIsWalletConnect={setIsWalletConnect}/>
      </header>

      <Routes>
        <Route exact path='/' element={<Swap/>}/>
        <Route exact path='/liquidity' element={<Liquidity/>}/>
        <Route exact path='/farm' element={<Farm/>}/>
        <Route exact path='/stake' element={<Stake/>}/>
        <Route exact path='*' element={<div>Page not found...</div>}/>
      </Routes>
      {loader && <div className="loader">
        <img src={loaderImg} alt='loading'/>
      </div>}
    </div>
  );
}

export default App;
