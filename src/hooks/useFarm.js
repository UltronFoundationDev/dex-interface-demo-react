import {ethers, Contract} from 'ethers';
import {abiFactory, addressFactory, addressFactory1} from "../constants/contract/factory";
import {abiFarm, addressFarm, addressFarm1} from "../constants/contract/farm";
import {abiPair} from "../constants/contract/pair";
import {toWei} from "../utils/wei";

let poolId = 0;

export const useFarm = () => {
  const onDeposit = async (amount, tokens) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const Factory = new Contract(addressFactory, abiFactory, signer)
      const Farm = new Contract(addressFarm, abiFarm, signer)
      const signAddress = await signer.getAddress()
      console.log(Farm, Factory)
      const pairAddress = await Factory.getPair(tokens[0].address, tokens[1].address)
      console.log(pairAddress)
      const pair = new Contract(pairAddress, JSON.stringify(abiPair), provider).connect(signer)
      // console.log(await Farm.poolInfo(toWei(1)), 'poolInfo')
      // const pairApprove = await pair.approve(addressFarm, toWei(amount), {from: signAddress})
      // await pairApprove.wait()
      const deposit = await Farm.deposit(poolId, toWei(amount), {from: signAddress})
      console.log(deposit, {poolId})
    }catch (e) {
      console.log({e}, {poolId})
      // poolId++
    }
  }
  const onWithdraw = async (amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Farm = new Contract(addressFarm, abiFarm, signer)
    const signAddress = await signer.getAddress()
    const withdraw = await Farm.withdraw(poolId, toWei(amount), {from: signAddress})
    console.log(withdraw)
  }
  const onHarvest = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const Farm = new Contract(addressFarm, abiFarm, signer)
    const signAddress = await signer.getAddress()
    const withdraw = await Farm.withdraw(poolId, 0, {from: signAddress})
    console.log(withdraw)
  }
  const onAdd = () => {
    // const farmAdd = await Farm.add(toWei('2000'), pair.address, true, { from: await signer.getAddress() })
  }

  return {onDeposit, onWithdraw, onAdd, onHarvest}
}
