
import { ethers } from 'ethers'
import { TransactionManager } from '../ethers-network/transaction'
import { ContractGeneric, initContract, ContractFunction } from '../ethers-network/contract'

import jsonGSpot from './GSpot.json'

export class ContractGSpot extends ContractGeneric {
  readonly [key: string]: ContractFunction | any
  constructor(contract: ethers.Contract, transactionManager: TransactionManager) {
    super(contract, transactionManager)
    initContract(this, jsonGSpot.abi)
  }
}

export const getContractNFT = (
  contractAddress: string,
  signer: ethers.Signer,
) => {
  return new ethers.Contract(
    contractAddress,
    jsonGSpot.abi,
    signer,
  )
}
