import {Contract, ethers} from "ethers";
import {abiToken1} from "../constants/contract/tokens";

export const addToken = async (amountOut, tokenAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner()
  const Token1 = new Contract(tokenAddress, abiToken1, signer)

  const add = await provider.provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: await Token1.symbol(),
        decimals: 18,
      },
    },
  })
  console.log(add)
}
