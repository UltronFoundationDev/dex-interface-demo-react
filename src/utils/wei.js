import {ethers} from "ethers";

export const toWei = (value) => ethers.utils.parseEther(value.toString());
export const fromWei = (value) => Number(value) / 1e18;
