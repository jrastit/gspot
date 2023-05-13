import { NetworkType } from '../network/networkType'
import { getNetworkList } from '../network/networkInfo'
import { TransactionManager } from './TransactionManager'
import { getProvider } from '../network/networkInfo'
import TimerSemaphore from '../util/TimerSemaphore'
import { Wallet, BigNumber } from 'ethers'
import { utils } from 'ethers'

export enum TMWalletState {
  Init,
}

export interface TMNetwork {
  transactionManager: TransactionManager
  balance: BigNumber | undefined
  network: NetworkType
  state: TMWalletState
}

export class TMWallet {

  transactionManagerList: TMNetwork[]
  address: string | undefined
  state: TMWalletState
  pkey: string | undefined
  dispatch: any | undefined
  setBalance?: (payload: {
    balance: number,
    address: string,
    chainId: number,
  }) => any

  constructor(
    pkey?: string | undefined,
    dispatch?: any | undefined,
    setBalance?: ((payload: {
      balance: number,
      address: string,
      chainId: number,
    }) => any) | undefined
  ) {
    this.address = undefined
    this.pkey = pkey
    this.transactionManagerList = []
    this.state = TMWalletState.Init
    this.dispatch = dispatch
    this.setBalance = setBalance
    this.init()
  }

  init(

  ) {
    getNetworkList().forEach(network => this.addNetwork(network))
  }

  release() {
    this.transactionManagerList.forEach(tMNetwork => tMNetwork.transactionManager.release())
  }

  async refreshBalance(
    chainId: number,
  ) {
    try {
      const tmnetwork = this.getTMNetwork(chainId)
      if (tmnetwork) {
        this.updateBalance(
          await tmnetwork.transactionManager.getBalance(),
          await tmnetwork.transactionManager.getAddress(),
          await tmnetwork.transactionManager.getChainId(),
        )
      }
    } catch (error) {

    }

  }

  updateBalance(
    balance: BigNumber,
    address: string,
    chainId: number,
  ) {
    if (this.address === undefined) {
      this.address = address
    }
    const tmnetwork = this.getTMNetwork(chainId)
    if (tmnetwork) {
      tmnetwork.balance = balance
    }
    const _balance = parseFloat(
      utils.formatEther(
        balance
      )
    )
    if (this.dispatch && this.setBalance) {
      this.dispatch(this.setBalance({
        chainId: chainId,
        address: address,
        balance: _balance
      }))
    }
  }

  getTMNetwork(
    chainId: number
  ): TMNetwork | undefined {
    const tmNetworkList = this.transactionManagerList.filter(tmnetwork => {
      return tmnetwork.network.chainId === chainId
    })
    if (tmNetworkList.length) {
      return tmNetworkList[0]
    }
    return undefined
  }

  addNetwork(network: NetworkType) {
    if (!this.pkey) {
      throw new Error('Private key is not set')
    }
    if (this.transactionManagerList.filter(tmnetwork => {
      return tmnetwork.network.chainId === network.chainId
    }).length > 0) {
      throw new Error('Network already present')
    }
    let errorWallet = undefined
    const setErrorWallet = (error: string) => {
      errorWallet = error
    }
    const provider = getProvider(network, setErrorWallet)

    if (provider && !errorWallet) {
      const wallet = new Wallet(
        this.pkey,
        provider
      )
      let timerSemaphore
      if (network.timeBetweenRequest) {
        timerSemaphore = new TimerSemaphore(
          network.timeBetweenRequest,
          network.retry,
        )
      }
      const transactionManager = new TransactionManager(
        wallet,
        timerSemaphore,
      )
      if (network.refreshBalance) {
        transactionManager.refreshBalance(
          network.refreshBalance,
          this.updateBalance
        )
      } else {
        provider.on('block', () => {
          this.refreshBalance(network.chainId)
        })
      }
      this.transactionManagerList.push({
        transactionManager: transactionManager,
        balance: undefined,
        network,
        state: TMWalletState.Init
      })
    }

  }



}
