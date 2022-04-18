import {ethers, Contract} from 'ethers';
import {abiFactory, addressFactory} from "../constants/contract/factory";
import {abiAceLab, acelabAddress, acelabAddress1} from "../constants/contract/acelab";
import {abiToken1, abiTokenXUlx, wULXAddress, xULXAddress} from "../constants/contract/tokens";
import {abiPair} from "../constants/contract/pair";
import {toWei} from "../utils/wei";

const poolId = 0;

const MaxUint256 = ethers.constants.MaxUint256;
export const useStake = () => {
  const onConvertLPTokenInXToken = async (amount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const wULX = new Contract(wULXAddress, abiToken1, signer);
      const xULX = new Contract(xULXAddress, abiTokenXUlx, signer);

      const wULXApprove = await wULX.approve(xULXAddress, toWei(amount))
      await wULXApprove.wait()

      const convertInXUlx = await xULX.enter(toWei(amount))

      console.log(convertInXUlx)
      await convertInXUlx.wait();
    } catch (e) {
      console.log(e)
    }
  }

  const onDeposit = async (amount, tokens) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const xULX = new Contract(xULXAddress, abiTokenXUlx, signer);
    const Stake = new Contract(acelabAddress, abiAceLab, signer)
    const signAddress = await signer.getAddress()
    const wULXApprove = await xULX.approve(acelabAddress, toWei(amount))
    await wULXApprove.wait()
    const deposit = await Stake.deposit(poolId, toWei(amount), {from: signAddress})
    console.log(deposit)
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
    const withdraw = await Stake.withdraw(poolId, toWei(0), {from: signAddress})
    console.log(withdraw)
  }
  const onAdd = () => {


  }

  return {onDeposit, onWithdraw, onAdd, onHarvest, onConvertLPTokenInXToken}
}
