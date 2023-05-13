import { Contract, EventFilter } from 'ethers'
import { Listener } from '@ethersproject/abstract-provider'
import { TransactionManager, TransactionInfoType, getErrorMessage } from '../transaction/TransactionManager'

export type ContractFunction<T = any> = (...args: Array<any>) => Promise<T>;

function initContract(contractClass: any, abi: any[]) {
  //console.log('init contract')
  //test(contract)
  //console.log(jsonGameManager.abi)
  //const functionList = jsonGameManager.abi.filter(obj => obj.type === "function" && (obj.stateMutability === "payable" || obj.stateMutability === "nonpayable"))
  //console.log(functionList)
  //ContractGameManager.prototype
  //console.log(getClassMethodNames(contract))
  const functionList = abi.filter(obj => obj.type === "function" && (obj.stateMutability === "payable" || obj.stateMutability === "nonpayable"))
  functionList.forEach(obj => {
    if (typeof obj.name === 'string') {
      const functionName = obj.name as string
      Object.defineProperty(contractClass, functionName, {
        value: async (...args: any[]) => {
          //console.log('contract populateTransaction')
          //console.log("call contract", functionName, ...args)
          const tx = await contractClass.transactionManager.populateTransaction(contractClass, functionName, ...args)
          //console.log('contract call')
          const ret = await contractClass.transactionManager.sendTx(
            tx,
            functionName,
            {
              transactionType: TransactionInfoType.ModifyContract,
              contractName: contractClass.constructor.name.substring(8),
              contractAddress: contractClass.address,
              functionName,
              args,
            }
          )
          //console.log('contract call end')
          return ret
        },
        writable: false,
        enumerable: true,
        configurable: true,
      })
    }

  })
  const viewList = abi.filter(obj => obj.type === "function" && (obj.stateMutability === "view" || obj.stateMutability === "pure"))
  viewList.forEach(obj => {
    if (typeof obj.name === 'string') {
      const functionName = obj.name as string
      //console.log("define view ", functionName)
      Object.defineProperty(contractClass, functionName, {
        value: async (...args: any[]) => {
          //console.log("call view ", functionName)
          try {
            //console.log('call view')
            const ret = await contractClass.transactionManager.callView(
              contractClass.contract.functions[functionName],
              ...args
            )
            //console.log("call view end")
            return ret
          } catch (err: any) {
            console.error(err)
            throw Error(getErrorMessage(err))
          }

        },
        writable: false,
        enumerable: true,
        configurable: true,
      })
    }

  })
}

class ContractGeneric {
  contract: Contract
  transactionManager: TransactionManager
  address: string
  listenerCount(eventName?: EventFilter | string) {
    return this.contract.listenerCount(eventName)
  }
  on(event: EventFilter | string, listener: Listener): this {
    this.contract.on(event, listener)
    return this
  }
  interface
  signer

  constructor(contract: Contract, transactionManager: TransactionManager) {
    this.address = contract.address
    this.contract = contract
    this.transactionManager = transactionManager
    this.interface = contract.interface
    this.signer = contract.signer
  }

  removeAllListeners() {
    if (this.listenerCount() > 0) {
      this.contract.removeAllListeners()
    }
  }

  release() {
    this.removeAllListeners()
  }

}

export { ContractGeneric, initContract }
