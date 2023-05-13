import * as ethers from 'ethers'
import {
  WalletType,
  walletListFromJson,
  walletListToJson,
  walletNiceName,
  WalletStorageType,
  walletStorageFromJson,
  walletStorageToJson,
} from '../wallet/walletType'

export const walletStorageLoad = (): WalletStorageType => {
  let walletStorage
  try {
    walletStorage = walletStorageFromJson(localStorage.getItem("walletStorage"))
    if (!walletStorage) {
      return {}
    }
  } catch (error) {
    console.error(error)
    return {}
  }
  return walletStorage
}

export const walletStorageSetType = (type: string | undefined) => {
  let walletStorage = walletStorageLoad()
  walletStorage.walletType = type
  walletStorageSave(walletStorage)
}

export const walletStorageSetWallet = (walletAddress: string | undefined) => {
  let walletStorage = walletStorageLoad()
  walletStorage.walletAddress = walletAddress
  walletStorageSave(walletStorage)
}

export const walletStorageSetNetworkId = (chainId: number | undefined) => {
  let walletStorage = walletStorageLoad()
  walletStorage.chainId = chainId
  walletStorageSave(walletStorage)
}

export const walletStorageClearPassword = () => {
  let walletStorage = walletStorageLoad()
  walletStorage.password = undefined
  walletStorageSave(walletStorage)
}

export const walletStorageUpdatePassword = (
  password: string | undefined,
  passwordCheck: string | undefined
) => {
  let walletStorage = walletStorageLoad()
  walletStorage.passwordCheck = passwordCheck
  walletStorage.password = password
  walletStorageSave(walletStorage)
  return walletStorage
}

export const walletStorageSave = async (walletStorage: WalletStorageType) => {
  let walletStorageStr
  try {
    walletStorageStr = walletStorageToJson(walletStorage)
    if (walletStorageStr) {
      localStorage.setItem("walletStorage", walletStorageStr)
    } else {
      console.error("Wallet config is empty")
    }
  } catch (error) {
    console.error(error)
  }
}

export const walletListLoad = async (password: string) => {
  let walletList
  try {
    walletList = walletListFromJson(localStorage.getItem("walletList"), password)
    if (walletList) {
      walletList.sort((a, b) => {
        const name = walletNiceName(a)
        const name2 = walletNiceName(b)
        return (name > name2) ? 1 : ((name > name2) ? -1 : 0)
      })
    }
  } catch (error) {
    console.error(error)
    return
  }
  return walletList
}

export const walletListLoadAddress = async (address: string, password: string) => {
  const walletList = await walletListLoad(password)
  if (walletList) {
    const walletAddress = walletList.filter(wallet => wallet.address === address)
    if (walletAddress) return walletAddress[0]
  }
}

const walletListSave = async (walletList: WalletType[], password: string) => {
  let walletListStr
  try {
    walletListStr = walletListToJson(walletList, password)
    if (walletListStr) {
      localStorage.setItem("walletList", walletListStr)
    } else {
      console.error("Wallet list is empty")
    }
  } catch (error) {
    console.error(error)
  }
}

export const walletAdd = async (name: string, pkey: string, password: string) => {
  let ethersWallet: ethers.Wallet
  if (!pkey) {
    ethersWallet = ethers.Wallet.createRandom()
    pkey = ethersWallet.privateKey
  } else {
    ethersWallet = new ethers.Wallet(pkey)
  }
  const wallet: WalletType = {
    name,
    address: await ethersWallet.getAddress(),
    pkey,
  }
  let walletList = await walletListLoad(password)
  if (!walletList) {
    walletList = []
  }
  if (walletList.filter((_wallet) => wallet.address === _wallet.address).length > 0) {
    throw new Error("Wallet address already present")
  }
  walletList.push(wallet)
  walletListSave(walletList, password)
  return wallet
}

export const walletDelete = async (address: string, password: string) => {
  let walletList = await walletListLoad(password)
  if (walletList) {
    walletList = walletList.filter(wallet => wallet.address !== address)
    walletListSave(walletList, password)
  }
}

export const walletListDelete = () => {
  localStorage.removeItem("walletList")
  localStorage.removeItem("walletStorage")
}
