import {Contract, ethers} from "ethers";
import {abiToken1} from "../constants/contract/tokens";
import {onFixedValue} from "./changeLengthValue";

export const currencyTokenInAddress = async (tokenAddress, setBalance) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const Token = new Contract(tokenAddress, abiToken1, signer)
  await Token.balanceOf(signer.getAddress()).then(r => setBalance(onFixedValue(Number(r) / 1e18)))
}

const getBalance = async (Token, signer, setBalance) => {
  await Token.balanceOf(signer.getAddress()).then(r => setBalance(Number(r) / 1e18))
}
