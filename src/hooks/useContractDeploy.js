import {ContractFactory, ethers} from 'ethers';

const toWei = (value) => ethers.utils.parseEther(value.toString());

export async function contractDeploy(wallet, abi, bytecode, amount = '10000') {
  const factory = new ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(toWei(amount));
  await contract.deployed();
  return contract;
}
