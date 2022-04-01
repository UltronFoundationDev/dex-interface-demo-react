import {ethers, Contract} from 'ethers';
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiPair} from "../constants/contract/pair";
import {abiRouter, addressRouter} from "../constants/contract/router";
import {abiToken1, tokenAddress1} from "../constants/contract/tokens";
import {addToken} from "../utils/addToken";

const toWei = (value) => ethers.utils.parseEther(value.toString());
const MaxUint256 = ethers.constants.MaxUint256;
const MINIMUM_LIQUIDITY = toWei(10).pow(3);

const overrides = {
  gasLimit: 1000000
}

const addLPToken = async (provider, Token1Address, Token2Address) => {
  const signer = provider.getSigner()
  const Factory = new Contract(addressFactory, abiFactory, signer)
  const pairAddress = await Factory.getPair(Token1Address, Token2Address)
  const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)
  const token = new Contract(pair.address, abiToken1, signer)

  const add = await provider
    .request('wallet_watchAsset',
      [{
        type: 'ERC20',
        options: {
          address: token.address
        },
      }]
    )
  console.log(add)
}

export const useLiquidity = (onNewLiquidityPosition) => {

  const onLiquidity = async (tokenForLiquidity, tokenOnLiquidity) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Router = new Contract(addressRouter, abiRouter, signer)

    const Token1 = new Contract(tokenForLiquidity.address, abiToken1, signer)
    const Token2 = new Contract(tokenOnLiquidity.address, abiToken1, signer)

    const t1Approve = await Token1.approve(Router.address, MaxUint256)
    const t2Approve = await Token2.approve(Router.address, MaxUint256)

    await t1Approve.wait()
    await t2Approve.wait()

    const trans = await Router.addLiquidity(
      Token1.address,
      Token2.address,
      toWei(tokenForLiquidity.value),
      toWei(tokenOnLiquidity.value),
      0,
      0,
      signer.getAddress(),
      MaxUint256,
      overrides
    )

    await trans.wait()

    const Factory = new Contract(addressFactory, abiFactory, signer)
    const pairAddress = await Factory.getPair(Token1.address, Token2.address)
    await addToken(tokenOnLiquidity.value, pairAddress)

    console.log(trans)

    const liquidPositions = JSON.parse(localStorage.getItem('liquid-position')) ?? [];

    const tokenLiquidBalance = [tokenForLiquidity.value, tokenOnLiquidity.value]

    const onNewLiquid = () => {
      const newLiquidPositions = [...liquidPositions, {
        id: liquidPositions.length + 1,
        nonce: trans.nonce,
        tokens: [
          {
            address: Token1.address,
            balance: tokenLiquidBalance[0],
            name: tokenForLiquidity.name
          },
          {
            address: Token2.address,
            balance: tokenLiquidBalance[1],
            name: tokenOnLiquidity.name
          }
        ]
      }]
      onNewLiquidityPosition(newLiquidPositions)
    }

    if (liquidPositions.length) {
      let isLiquidPositionInArray = false;

      for (let i = 0; i < liquidPositions.length; i++) {
        const {tokens} = liquidPositions[i];
        if (tokens[0].address === Token1.address && tokens[1].address === Token2.address) isLiquidPositionInArray = true;
      }

      if (isLiquidPositionInArray) {
        const liquidPosition = liquidPositions.find(i => i.tokens[0].address === Token1.address && i.tokens[1].address === Token2.address)
        const newLiquidPositions = liquidPositions.map(i => i.id === liquidPosition.id ? {
          ...liquidPosition,
          tokens: liquidPosition.tokens.map((t, index) => ({...t, balance: +tokenLiquidBalance[index] + +t.balance}))
        } : i)
        onNewLiquidityPosition(newLiquidPositions)
      } else {
        onNewLiquid()
      }
    } else {
      onNewLiquid()
    }


    await addLPToken(provider, Token1.address, Token2.address)

    return trans
  }

  const onDropLiquidity = async (liquidityId, percentWithdraw = 1) => {
    try {
      const liquidPosition = JSON.parse(localStorage.getItem('liquid-position')).find(i => i.id === liquidityId)
      if (!liquidPosition) return new Error('no have liquid positions')

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner()
      const Factory = new Contract(addressFactory, abiFactory, signer)
      const Token1 = new Contract(liquidPosition.tokens[0].address, abiToken1, signer)
      const Token2 = new Contract(liquidPosition.tokens[1].address, abiToken1, signer)

      const Router = new Contract(addressRouter, abiRouter, signer)

      const pairAddress = await Factory.getPair(Token1.address, Token2.address)
      const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)

      const pairApprove = await pair.approve(Router.address, MaxUint256)
      await pairApprove.wait()
      const expectedLiquidity = toWei(((Number(await pair.balanceOf(signer.getAddress())) / 1e18) * percentWithdraw).toFixed(7))


      const trans = await Router.removeLiquidity(
        Token1.address,
        Token2.address,
        expectedLiquidity,
        0,
        0,
        signer.getAddress(),
        MaxUint256,
        overrides
      )

      console.log(trans)

      await trans.wait()

      if (percentWithdraw === 1) {
        const liquidPositions = JSON.parse(localStorage.getItem('liquid-position'))
        const newLiquidPositions = liquidPositions.filter(i => i.id !== liquidityId)
        onNewLiquidityPosition(newLiquidPositions)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getLPTokenBalance = async (tokens, setLPTokenBalance) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const Factory = new Contract(addressFactory, abiFactory, signer)

      const pairAddress = await Factory.getPair(tokens[0].address, tokens[1].address)
      const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)
      const expectedLiquidity = await pair.balanceOf(signer.getAddress())
      setLPTokenBalance(Number(expectedLiquidity) / 1e18)
    } catch (e) {
      console.log(e)
    }
  }

  const getTokenBalance = async (tokens, setToken1Balance, setToken2Balance, setPercentMyLPTokenRelationTotal) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Factory = new Contract(addressFactory, abiFactory, signer)
    const Token1 = new Contract(tokens[0].address, abiToken1, signer)
    const Token2 = new Contract(tokens[1].address, abiToken1, signer)

    const pairAddress = await Factory.getPair(tokens[0].address, tokens[1].address)
    const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)

    const expectedLiquidity = await pair.balanceOf(signer.getAddress())
    const allLPToken = Number(await pair.totalSupply()) / 1e18;
    const myLPToken = Number(expectedLiquidity) / 1e18;
    const token1All = Number(await Token1.balanceOf(pairAddress)) / 1e18;
    const token2All = Number(await Token2.balanceOf(pairAddress)) / 1e18;

    const percentMyLPTokenRelationTotal = (myLPToken * 100) / allLPToken;
    const withdrawToken1InPair = (percentMyLPTokenRelationTotal * token1All) / 100;
    const withdrawToken2InPair = (percentMyLPTokenRelationTotal * token2All) / 100;

    setPercentMyLPTokenRelationTotal(percentMyLPTokenRelationTotal)
    setToken1Balance(withdrawToken1InPair.toFixed(5))
    setToken2Balance(withdrawToken2InPair.toFixed(5))
  }

  return {onLiquidity, onDropLiquidity, getLPTokenBalance, getTokenBalance}
}
