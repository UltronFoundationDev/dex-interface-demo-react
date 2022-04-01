import {Contract, ethers} from "ethers";
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiPair} from "../constants/contract/pair";
import {abiRouter, addressRouter} from "../constants/contract/router";
import {abiToken1, bytecodeToken1, bytecodeToken2, tokenAddress1, tokenAddress2} from "../constants/contract/tokens";
import {contractDeploy} from "../hooks/useContractDeploy";
const toWei = (value) => ethers.utils.parseEther(value.toString());

const token1Amount = toWei(0.0002)
const token2Amount = toWei(0.02)
const swapAmount = toWei(2)

const overrides = {
  gasLimit: 2000000
}

const MaxUint256 = ethers.constants.MaxUint256;
const AddressZero = ethers.constants.AddressZero;
const MINIMUM_LIQUIDITY = toWei(10).pow(3);

let t1 = "0x0c3a3897e4ECB4115e26228A29b25dccC52a86aB " // cT
let t2 = "0xe37c473B8fFD02D872030B890b33F31d2cC3908F" // bT
let t3 = "0x4f8e608a40523Bc6789ff8356502904e33a27d03" // bT

async function addLiquidity() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner()
  const Factory = new Contract(addressFactory, abiFactory, signer)
  const Token1 = new Contract(tokenAddress1, abiToken1, signer)
  const Token2 = new Contract(t3, abiToken1, signer)
  const Router = new Contract(addressRouter, abiRouter, signer)

  await Token1.approve(addressRouter, token1Amount)
  await Token2.approve(addressRouter, token2Amount)

  console.log(await Factory.createPair(Token1.address, Token2.address))

  const pairAddress = await Factory.getPair(Token1.address, Token2.address)
  const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)
  console.log(pair)

  console.log(await Router.addLiquidity(
    Token1.address,
    Token2.address,
    token1Amount,
    token2Amount,
    0,
    0,
    wallet.address,
    MaxUint256,
    overrides
  ))

  // await Token1.transfer(wallet.address, pair.address, token1Amount)
  // await Token2.transfer(wallet.address, pair.address, token2Amount)
  // await pair.transfer(AddressZero, AddressZero, MINIMUM_LIQUIDITY)
  // await pair.transfer(AddressZero, wallet.address, swapAmount.sub(MINIMUM_LIQUIDITY))
  // await pair.sync(token1Amount, token2Amount)
  // await pair.mint(Router.address, token1Amount, token2Amount)

  console.log(await pair.balanceOf(wallet.address));
}


const getSwap = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  const wallet = new ethers.Wallet('0x4f4b9489db2750be36c264763ea1aad839e8691aafbe621544cb290d4ef48692', provider)
  const signer = provider.getSigner()
  const Router = new Contract(addressRouter, abiRouter, signer)
  const Token1 = new Contract(tokenAddress1, abiToken1, signer)
  const Token2 = new Contract(tokenAddress2, abiToken1, signer)

  await Token1.approve(Router.address, token1Amount)
  await Token2.approve(Router.address, token2Amount)
  console.log(await Router.swapExactTokensForTokens(token1Amount, toWei(0), [Token1.address, Token2.address], wallet.address, toWei(10000000)))

}

const deployTokens = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  const wallet = new ethers.Wallet('0x4f4b9489db2750be36c264763ea1aad839e8691aafbe621544cb290d4ef48692', provider)
  console.log(wallet)
  const Token1 = await contractDeploy(wallet, abiToken1, bytecodeToken1)
  console.log(Token1)
  const Token2 = await contractDeploy(wallet, abiToken1, bytecodeToken2)
  t1 = Token1.address;
  t2 = Token2.address;
  console.log(t1, t2)
}

const balanceOf = async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner()
  const Token1 = new Contract(tokenAddress1, abiToken1, signer)
  console.log(Token1.balanceOf(signer.getAddress()), signer, provider)
}
