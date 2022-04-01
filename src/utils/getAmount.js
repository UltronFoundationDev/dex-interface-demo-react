import {Contract, ethers} from "ethers";
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiPair} from "../constants/contract/pair";
import {abiRouter, addressRouter} from "../constants/contract/router";
import {toFixed} from "./fixedValue";
import {fromWei, toWei} from "./wei";

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

export const getAmountOut = async (value, tokensAddress, setPrice) => {
  const {amount, reserves, Router} = await getAmount(value, tokensAddress)
  const amountOut = fromWei(await Router.getAmountOut(toWei(amount), reserves.reserve0, reserves.reserve1))
  setPrice(toFixed(amountOut, 8))
}

export const getAmountIn = async (value, tokensAddress, setPrice) => {
  const {amount, reserves, Router} = await getAmount(value, tokensAddress)
  const amountIn = fromWei(await Router.getAmountIn(toWei(amount), reserves.reserve0, reserves.reserve1))
  setPrice(toFixed(amountIn, 8))
}
