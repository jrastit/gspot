import { ethers } from 'ethers'

import { network as networkList } from '../config/network.json'
import { NetworkType } from './networkType'
import { WalletType } from '../wallet/walletType'
import { walletListLoad } from '../storage/walletStorage'

declare global {
  interface Window {
    ethereum: any;
  }
}

export const switchNetwork = (network: NetworkType) => {
  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
      chainId: "0x" + network.chainId.toString(16),
      rpcUrls: [network.url],
      chainName: network.name,
      nativeCurrency: {
        name: network.tokenName,
        symbol: network.tokenName,
        decimals: 18
      },
    }]
  });
}

export const getNetworkList = (): NetworkType[] => {
  //const networkList = require('../config/network.json').network as NetworkType[]
  const _networkList = networkList as NetworkType[]
  return _networkList.sort(
    (a: any, b: any) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
  )
}

export const getNetworkFromChainId = (chainId: number | undefined): NetworkType | undefined => {
  if (!chainId) return undefined
  const networkList = getNetworkList()
  return networkList.filter((network: any) => network.chainId === chainId)[0]
}

export const getNetworkFromName = (networkName: string) => {
  const networkList = getNetworkList()
  const network: NetworkType = networkList.filter((network) => network.name === networkName)[0]
  if (network) return network
  throw new Error('Network not found in configuration : ' + networkName)
}

export const getWalletList = async (password: string): Promise<WalletType[] | undefined> => {
  return await walletListLoad(password)
}

export const getProvider = (network: NetworkType, setError?: (error: string) => void): ethers.providers.Provider | undefined => {
  try {

    const provider = new ethers.providers.StaticJsonRpcProvider(network.url)
    provider.pollingInterval = 10000
    if (network.chainId === 0x5aff) {
      const sapphire = require('@oasisprotocol/sapphire-paratime')
      return sapphire.wrap(provider)
    }
    return provider
  } catch (error: any) {
    console.log(error)
    console.error('Provider not found for network : ', error)
    setError && setError("Error in Metamask : " + error.message)
  }
}

export const getWallet = (network: NetworkType, privateKeys: any): ethers.Wallet => {
  const provider = getProvider(network)
  if (provider) {
    const walletList = privateKeys.map((pk: string): ethers.Signer => {
      const wallet = new ethers.Wallet(pk, provider)
      if (network.chainId === 0x5aff) {
        const sapphire = require('@oasisprotocol/sapphire-paratime')
        return sapphire.wrap(wallet)
      }
      return wallet
    })
    return walletList[0]
  }
  throw new Error('Wallet not found for network : ' + network.name)
}

export const addHooks = () => {
  window.ethereum.on('chainChanged', (_chainId: number) => window.location.reload());
  window.ethereum.on('accountsChanged', (accounts: Array<string>) => { console.log(accounts); window.location.reload() });
}

export const getEntityRegistryAddress = (
  networkName: string,
) => {
  const networkList = require('../config/network.json').network as any
  return (networkList as NetworkType[]).filter((_networkItem) => _networkItem.name === networkName).map((_networkItem) => _networkItem.entityRegistryAddress)[0]
}

export const getWeb3Wallet = async () => {
  const web3Provider = new ethers.providers.Web3Provider(
    window.ethereum)
  const _network = await web3Provider.getNetwork()
  const signer = web3Provider.getSigner()
  const chainId = _network.chainId
  const network = getNetworkFromChainId(chainId)
  return { network, signer }
}

export const getAddress = (
  networkName: string,
  wallet: ethers.Wallet,
  setAddress: (
    networkName: string | undefined,
    address: string,
    wallet: ethers.Wallet | undefined) => void,
) => {
  wallet.getAddress().then(
    (address) => {
      setAddress(networkName, address, wallet)
    }).catch(
      err => {
        console.error("error in get address ", err)
        setAddress(undefined, "error", undefined)
      }
    )
}

export const getBalance = async (
  wallet: ethers.Wallet,
  address: string,
  setBalance: (balance: ethers.BigNumber) => void
) => {
  wallet.provider.getBalance(address).then(
    (balance) => {
      setBalance(balance)
    }).catch(err => console.error("error in get balance ", err))
}
