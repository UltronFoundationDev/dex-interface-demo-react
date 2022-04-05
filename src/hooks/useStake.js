import {ethers, Contract} from 'ethers';
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiAceLab, acelabAddress} from "../constants/contract/acelab";
import {abiPair} from "../constants/contract/pair";
import {toWei} from "../utils/wei";

const poolId = 0;

export const useStake = () => {
  const onDeposit = async (amount, tokens) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Factory = new Contract(addressFactory, abiFactory, signer)
    const Stake = new Contract(acelabAddress, abiAceLab, signer)
    const signAddress = await signer.getAddress()
    console.log(Stake)
    // const pairAddress = await Factory.getPair(tokens[0].address, tokens[1].address)
    // const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)
    //
    // const pairApprove = await pair.approve(acelabAddress, toWei(amount), {from: signAddress})
    // await pairApprove.wait()
    //
    // const deposit = await Stake.deposit(poolId, toWei(amount), {from: signAddress})
    // console.log(deposit)
  }
  const onWithdraw = async (amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Stake = new Contract(acelabAddress, abiAceLab, signer)
    const signAddress = await signer.getAddress()
    const withdraw = await Stake.withdraw(poolId, toWei(amount), {from: signAddress})
    console.log(withdraw)
  }
  const onHarvest = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Stake = new Contract(acelabAddress, abiAceLab, signer)
    const signAddress = await signer.getAddress()
    const withdraw = await Stake.withdraw(poolId, 0, {from: signAddress})
    console.log(withdraw)
  }
  const onAdd = () => {


  }

  return {onDeposit, onWithdraw, onAdd, onHarvest}
}
