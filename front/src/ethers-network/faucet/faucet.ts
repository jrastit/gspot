import * as ethers from 'ethers'

import { NetworkType } from '../network/networkType'
import { getWallet, getNetworkFromChainId } from '../network/networkInfo'

export const getFaucetAmount = async (network: NetworkType, wallet: ethers.Wallet, address: string) => {
  if (!network.faucetAmount || network.faucetAmount === 0) {
    throw new Error('Faucet not set for : ' + network.name)
  }
  const faucetBalance = await wallet.provider.getBalance(wallet.address)
  const faucetBalanceInEth = parseFloat(ethers.utils.formatEther(faucetBalance))
  if (network.faucetAmount > faucetBalanceInEth) {
    throw new Error('Faucet is empty for : ' + network.name)
  }
  const balance = await wallet.provider.getBalance(address)
  const balanceInEth = parseFloat(ethers.utils.formatEther(balance))
  if (network.faucetAmount <= balanceInEth) {
    throw new Error('Address balance is greater or equal than faucet : ' + balanceInEth)
  }
  return network.faucetAmount - balanceInEth
}

export const checkFaucet = async (chainId: number, privateKeys: any, address: string) => {
  const network = getNetworkFromChainId(chainId)
  if (!network) throw new Error('Network error')
  const wallet = getWallet(network, privateKeys)
  return await getFaucetAmount(network, wallet, address)
}

export const faucet = async (address: string, chainId: number, privateKeys: any) => {
  const network = getNetworkFromChainId(chainId)
  if (!network) throw new Error('Network error')
  const wallet = getWallet(network, privateKeys)
  const faucetAmount = await getFaucetAmount(network, wallet, address)
  console.log('Faucet ' + address + ' ' + faucetAmount)
  const ret = await wallet.sendTransaction({
    to: address,
    value: ethers.utils.parseEther(faucetAmount.toString())
  })
  //console.log(ret)
  await ret.wait()
  return
}
