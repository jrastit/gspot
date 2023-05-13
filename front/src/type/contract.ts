import { BigNumber } from 'ethers'

import {
  ContractAlketh,
  ContractGameManager,
  ContractNFT,
  ContractPlayBot,
  ContractPlayGameFactory,
  ContractPlayActionLib,
  ContractPlayGame,
  ContractCardList,
  ContractGameList,
} from 'alketh-contract'

import {
  TransactionManager
} from '../util/TransactionManager'

export type ContractType<Contract> = {
  name: string
  contractHash?: BigNumber | undefined
  versionOk?: boolean | undefined
  getContract: () => Contract
  getContractNotOk: () => Contract
  setContract: (contract: Contract) => void
  isContract: () => boolean
}

export type ContractHandlerType = {
  transactionManager: TransactionManager
  alketh: ContractType<ContractAlketh>
  gameManager: ContractType<ContractGameManager>
  cardList: ContractType<ContractCardList>
  gameList: ContractType<ContractGameList>

  nft: ContractType<ContractNFT>

  playGameFactory: ContractType<ContractPlayGameFactory>
  playGame: ContractType<ContractPlayGame>
  playActionLib: ContractType<ContractPlayActionLib>

  playBot: ContractType<ContractPlayBot>

}

class newContract<Contract extends { release: () => void }>{
  name: string
  private contract?: Contract
  contractHash?: BigNumber | undefined
  versionOk?: boolean | undefined

  getContractNotOk() {
    if (!this.contract) {
      throw Error("Contract " + this.name + " not set")
    }
    return this.contract
  }
  getContract() {
    if (!this.contract) {
      throw Error("Contract " + this.name + " not set")
    }
    if (!this.versionOk) {
      throw Error("Contract " + this.name + " not ok")
    }
    return this.contract
  }
  setContract(contract: Contract) {
    if (this.contract)
      this.contract.release()
    this.contract = contract
  }
  isContract() {
    if (this.contract) return true
    return false
  }
  constructor(name: string) {
    this.name = name
  }
}

export const newContractHandler = (
  transactionManager: TransactionManager
): ContractHandlerType => {
  return {
    transactionManager: transactionManager,
    alketh: new newContract<ContractAlketh>("Alketh"),
    gameManager: new newContract<ContractGameManager>("Game Manager"),
    nft: new newContract<ContractNFT>("NFT"),
    playGameFactory: new newContract<ContractPlayGameFactory>("Play Game Factory"),
    playGame: new newContract<ContractPlayGame>("Play Game"),
    playActionLib: new newContract<ContractPlayActionLib>("Play Action Lib"),
    playBot: new newContract<ContractPlayBot>("Play Bot"),
    cardList: new newContract<ContractCardList>("Card List"),
    gameList: new newContract<ContractGameList>("Game List"),
  }
}
