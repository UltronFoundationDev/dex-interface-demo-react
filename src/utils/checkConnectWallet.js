import {ethers} from "ethers";

export const checkConnectWallet = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
}
