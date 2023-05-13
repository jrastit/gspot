import { BigNumber } from 'ethers'

export type ContractType<Contract> = {
  name: string
  contractHash?: BigNumber | undefined
  versionOk?: boolean | undefined
  getContract: () => Contract
  getContractNotOk: () => Contract
  setContract: (contract: Contract) => void
  isContract: () => boolean
}

export class newContract<Contract extends { release: () => void }>{
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
