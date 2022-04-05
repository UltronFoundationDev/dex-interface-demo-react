import {ethers, Contract, utils} from 'ethers';
import {useDispatch} from "react-redux";
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiPair} from "../constants/contract/pair";
import {abiRouter, addressRouter} from "../constants/contract/router";
import {abiToken1} from "../constants/contract/tokens";
import {setLoader} from "../redux/reducers/loader";
import {addToken} from "../utils/addToken";
import {toFixed} from "../utils/fixedValue";
import {fromWei, toWei} from "../utils/wei";
import {contractDeploy} from "./useContractDeploy";

export const useSwap = () => {
  const dispatch = useDispatch()
  const onSwap = async (tokenForSwap, tokenOnSwap) => {
    try {
      dispatch(setLoader(true))
      const provider = new ethers.providers.Web3Provider(window.ethereum)//fixme: сделать функ. для получение провайдера и сигнера
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner()
      const Router = new Contract(addressRouter, abiRouter, signer)
      const Token1 = new Contract(tokenForSwap.address, abiToken1, signer)
      const Token1Approve = await Token1.approve(Router.address, toWei(tokenForSwap.value))
      console.log(await Token1Approve.wait());
      const trans = await Router.swapExactTokensForTokens(
        toWei(tokenForSwap.value),
        toWei(0),
        [Token1.address, tokenOnSwap.address],
        await signer.getAddress(),
        toWei(10000000)
      )
      console.log(await trans.wait());
      dispatch(setLoader(false))
      await addToken(tokenOnSwap.value, tokenOnSwap.address)
      return trans
    } catch (err) {
      dispatch(setLoader(false))
      console.log(err)
    }

  }

  const OnAddToken = async (name, amount, privateKey) => {
    console.log(name, amount, privateKey)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const wallet = new ethers.Wallet(privateKey, provider)

    const newToken = await contractDeploy(wallet, abiToken1, name, amount)
    console.log(newToken)
  }

  const getAmount = async (amount, tokensAddress) => {
    if (+amount <= 0) return 0
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Router = new Contract(addressRouter, abiRouter, signer)
    const Factory = new Contract(addressFactory, abiFactory, signer)
    const pairAddress = await Factory.getPair(tokensAddress[0], tokensAddress[1])
    if (!pairAddress) return alert('Pair for swap is not defined')

    const pair = new Contract(pairAddress, JSON.stringify(abiPair), signer)
    const reserves = await pair.getReserves();

    return {amount, reserves, Router}
  }

  const getAmountOut = async (value, tokensAddress, setPrice) => {
    const {amount, reserves, Router} = await getAmount(value, tokensAddress)
    const amountOut = fromWei(await Router.getAmountOut(toWei(amount), reserves.reserve0, reserves.reserve1))
    setPrice(toFixed(amountOut, 8))
  }

  const getAmountIn = async (value, tokensAddress, setPrice) => {
    const {amount, reserves, Router} = await getAmount(value, tokensAddress)
    const amountIn = fromWei(await Router.getAmountIn(toWei(amount), reserves.reserve0, reserves.reserve1))
    setPrice(toFixed(amountIn, 8))
  }

  const getPriceImpact = async (amount, tokensAddress, setPriceImpact) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Factory = new Contract(addressFactory, abiFactory, signer)
    const pairAddress = await Factory.getPair(tokensAddress[0], tokensAddress[1])
    const pair = new Contract(pairAddress, JSON.stringify(abiPair), signer)
    const reserves = await pair.getReserves();

    const reserve_a_initial = parseFloat(utils.formatUnits(reserves.reserve0));
    const reserve_b_initial = parseFloat(utils.formatUnits(reserves.reserve1));

    const fee = 0.0025;
    const amountInWithFee = amount * (1 - fee);
    const constant_product = reserve_a_initial * reserve_b_initial;
    const reserve_b_after_execution = constant_product / (reserve_a_initial + amountInWithFee);
    const amountOut = reserve_b_initial - reserve_b_after_execution;
    const market_price = amountInWithFee / amountOut;
    const mid_price = reserve_a_initial / reserve_b_initial;
    const price_impact = 1 - (mid_price / market_price);
    setPriceImpact(price_impact)
  }

  return {onSwap, OnAddToken, getAmountOut, getAmountIn, getPriceImpact}
}
