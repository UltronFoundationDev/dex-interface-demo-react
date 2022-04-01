import React, {useLayoutEffect, useState} from "react";
import {Routes, Route, Link} from 'react-router-dom';
import WalletConnect from "./components/wallet-connect";
import Farm from "./pages/farm";
import Liquidity from "./pages/liquidity";
import Swap from "./pages/swap";
import {checkConnectWallet} from "./utils/checkConnectWallet";

function App() {
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
        </menu>
        <WalletConnect setIsWalletConnect={setIsWalletConnect}/>
      </header>

      <Routes>
        <Route exact path='/' element={<Swap/>}/>
        <Route exact path='/liquidity' element={<Liquidity/>}/>
        <Route exact path='/farm' element={<Farm/>}/>
        <Route exact path='*' element={<div>Page not found...</div>}/>
      </Routes>
    </div>
  );
}

export default App;
