import { BigNumber, utils as ethersUtils } from 'ethers'
import ethers from 'ethers'

import TimerSemaphore from './TimerSemaphore'
import { ReplayScript } from './ReplayScript'

export enum TransactionInfoType {
  CreateContract,
  ModifyContract,
  ReadContract,
}

export interface TransactionInfo {
  transactionType: TransactionInfoType
  contractName?: string
  contractAddress?: string
  functionName?: string
  args: any

}

export interface TransactionGasInfo {
  gasLimitEstimated: BigNumber
  gasPriceEstimated: BigNumber
}

export interface TransactionItem {
  txu: ethers.ethers.PopulatedTransaction | ethers.providers.TransactionRequest,
  tx?: ethers.ethers.providers.TransactionResponse
  result?: ethers.ethers.providers.TransactionReceipt
  gasInfo: TransactionGasInfo
  log?: string
  transactionInfo?: TransactionInfo
  error?: string
}

export function getErrorMessage(err: any) {
  //console.error(err)
  let message
  try {
    message = JSON.parse(err.error.body).error.message
  } catch {
    if (err.error) {
      message = err.error
    } else {
      message = err
    }

  }
  return message
}

export class TransactionManager {

  replayScript: ReplayScript | undefined

  signer: ethers.Signer

  transactionList: TransactionItem[]

  nextNonce: number

  timerSemaphore: TimerSemaphore | undefined

  balanceInterval: NodeJS.Timer | undefined

  constructor(signer: ethers.Signer, timerSemaphore?: TimerSemaphore) {
    this.signer = signer
    this.transactionList = []
    this.nextNonce = -1
    this.timerSemaphore = timerSemaphore
  }

  setReplayScript(replayScript?: ReplayScript) {
    if (!replayScript) {
      replayScript = new ReplayScript()
    }
    this.replayScript = replayScript
  }

  async getBalance() {
    if (this.timerSemaphore) {
      return this.timerSemaphore.callClassFunction(this.signer, this.signer.getBalance) as Promise<ethers.BigNumber>
    } else {
      return this.signer.getBalance()
    }
  }

  clearRefreshBalance() {
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval)
    }
    this.balanceInterval = undefined
  }

  refreshBalance(interval: number, dispatch: any, updateBalance: (
    dispatch: any,
    balance: BigNumber,
    address: string,
    chainId: number,
  ) => Promise<number>) {
    this.clearRefreshBalance()
    this.balanceInterval = setInterval(async () => {
      await updateBalance(
        dispatch,
        await this.getBalance(),
        await this.getAddress(),
        await this.getChainId()
      )
    }, interval)
    console.log(this)
  }

  release() {
    this.clearRefreshBalance()
    this.signer.provider ?.removeAllListeners()
  }

  async getNonce() {
    if (this.nextNonce === -1) {
      if (this.timerSemaphore) {
        this.nextNonce = await this.timerSemaphore.callClassFunction(
          this.signer,
          this.signer.getTransactionCount
        ) as number
      } else {
        this.nextNonce = await this.signer.getTransactionCount()
      }
    } else {
      this.nextNonce = this.nextNonce + 1
    }
    return this.nextNonce
  }

  async populateTransaction(contractClass: any, functionName: string, ...args: any[]) {
    if (this.timerSemaphore) {
      return this.timerSemaphore.callClassFunction(this, this._populateTransaction, contractClass, functionName, ...args) as Promise<ethers.ethers.PopulatedTransaction>
    }
    return this._populateTransaction(contractClass, functionName, ...args)

  }

  async _populateTransaction(contractClass: any, functionName: string, ...args: any[]) {
    return contractClass.contract.populateTransaction[functionName](...args)
  }

  async sendTx(
    txu: ethers.ethers.PopulatedTransaction | ethers.providers.TransactionRequest,
    log: string,
    transactionInfo: TransactionInfo
  ) {
    if (!txu) {
      console.error(txu)
    }
    if (this.timerSemaphore) {
      return this.timerSemaphore.callClassFunction(
        this,
        this._sendTx,
        txu,
        log,
        transactionInfo
      ) as Promise<TransactionItem>
    } else {
      return this._sendTx(txu, log, transactionInfo)
    }
  }

  async _sendTx(
    txu: ethers.ethers.PopulatedTransaction | ethers.providers.TransactionRequest,
    log: string,
    transactionInfo: TransactionInfo
  ) {
    const transactionItem = {
      txu,
      log,
      transactionInfo,
      gasInfo: {}
    } as TransactionItem
    this.transactionList.push(transactionItem)
    try {
      transactionItem.txu.nonce = await this.getNonce()
      transactionItem.gasInfo.gasPriceEstimated = await this.signer.getGasPrice()
      transactionItem.txu.gasPrice = transactionItem.gasInfo.gasPriceEstimated
      transactionItem.gasInfo.gasLimitEstimated = await this.signer.estimateGas(txu)
      transactionItem.txu.gasLimit = transactionItem.gasInfo.gasLimitEstimated.mul(150).div(100)
      if (transactionItem.txu.gasLimit.gt(BigNumber.from(10000000))) {
        transactionItem.txu.gasLimit = BigNumber.from(10000000)
      }
      console.log(transactionItem.txu.gasLimit.toNumber())
      transactionItem.tx = await this.signer.sendTransaction(txu)
      transactionItem.result = await transactionItem.tx.wait()
      /*
      console.log("Success => " +
        log +
        ":" +
        transactionItem.txu.nonce +
        ' ' +
        transactionItem.result.gasUsed.toNumber() +
        ' ' +
        (Math.round(transactionItem.result.gasUsed.mul(10000).div(transactionItem.txu.gasLimit).toNumber()) / 100) +
        '% ' +
        ethers.utils.formatEther(transactionItem.txu.gasPrice.mul(transactionItem.result.gasUsed)))
      */
      const gasUsed = BigNumber.from(transactionItem.result.gasUsed)
      const value = transactionItem.txu.value ? BigNumber.from(transactionItem.txu.value) : BigNumber.from(0)
      const gasPrice = BigNumber.from(transactionItem.txu.gasPrice)
      console.log(
        TransactionInfoType[transactionInfo.transactionType],
        transactionInfo.contractName,
        transactionInfo.functionName,
        transactionInfo.args,
        ethersUtils.formatEther(gasUsed.add(value).mul(gasPrice)),
        gasUsed.mul(100).div(transactionItem.gasInfo.gasLimitEstimated).toNumber(),
      )
      if (this.replayScript) this.replayScript.addItem(transactionItem)
      return transactionItem
    } catch (e: any) {
      console.error(TransactionInfoType[transactionInfo.transactionType], transactionInfo.contractName, transactionInfo.functionName, transactionInfo.args, getErrorMessage(e))
      this.nextNonce = -1
      transactionItem.error = getErrorMessage(e)
      if (this.replayScript) this.replayScript.addItemError(transactionItem)
      throw new Error(log + ' : ' + transactionItem.error)
    }

  }

  async callView(fnToCall: any, ...args: any[]) {
    if (this.timerSemaphore) {
      return this.timerSemaphore.callFunction(fnToCall, ...args) as Promise<any>
    } else {
      return fnToCall(...args)
    }
  }

  async sendContractTx(
    txu: ethers.providers.TransactionRequest,
    getContract: (
      contractAddress: string,
      signer: ethers.Signer,
    ) => ethers.Contract,
    log: string,
    contractName: string,
    args: any[],
  ) {
    const result = await this.sendTx(txu, log, {
      transactionType: TransactionInfoType.CreateContract,
      contractName: contractName,
      args
    })
    if (result.result) {
      const contract = getContract(result.result.contractAddress, this.signer)
      return contract
    }
    throw Error("contract error")
  }

  gasInfo(
    transactionItem: TransactionItem
  ) {
    return {
      transactionHash: transactionItem.result ?.transactionHash,
      log: transactionItem.log,
      gasUsed: transactionItem.result ?.gasUsed.toNumber(),
      gasLimit: transactionItem.tx ?.gasLimit.toNumber(),
      gasPrice: transactionItem.tx ?.gasPrice && transactionItem.tx ?.gasPrice.toNumber(),
    }
  }

  log(
    transactionItem: TransactionItem
  ) {
    return transactionItem.log
  }

  async getAddress() {
    return await this.signer.getAddress()
  }

  async getChainId() {
    return await this.signer.getChainId()
  }
}
