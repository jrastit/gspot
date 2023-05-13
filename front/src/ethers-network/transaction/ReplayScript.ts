import { BigNumber } from 'ethers'
import { TransactionItem, TransactionInfoType, TransactionInfo } from './TransactionManager'

function addslashes(str: string | undefined) {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}

export class ReplayScript {
  contractMap = new Map<string, string>()
  transactionList = [] as (TransactionInfo | { contractVar: string })[]
  script = [] as string[]
  contractId = 0
  gameId = 0
  nextPlayGameVar = undefined as string | undefined
  isTest = false

  argToString(arg: any): any {
    if (Array.isArray(arg)) {
      const argArray = arg as any[]
      return "[" + argArray.map(_arg => { return this.argToString(_arg) }) + "]"
    }
    if ((arg instanceof BigNumber)) {
      return "\"" + arg + "\""
    }
    if ((typeof arg === 'string')) {
      if (this.contractMap.has(arg)) {
        return this.contractMap.get(arg) + '.address'
      }
      return "\"" + addslashes(arg) + "\""
    }
    return arg
  }

  addItemError(transactionItem: TransactionItem) {
    this.addItem(transactionItem)
    if (this.isTest) {
      const result = "const { ethers } = require(\"hardhat\")\n\n" +
        "describe(\"test\", function () {\n" +
        "\tit(\"test\", async function () {\n" +
        this.script.map(str => { return "\t\t" + str + "\n" }).join("") +
        "\t})\n" +
        "})"
      console.log(result)
    } else {
      const result = "import { ethers } from 'ethers'\n\n" +
        "const getContractFactory = async (contractName : string, signer : ethers.Signer) => {\n" +
        "\tconst artifactsPath = `browser/contracts/artifacts/${contractName}.json`\n" +
        "\tconst metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))\n" +
        "\tconst factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)\n" +
        "\treturn factory\n" +
        "}\n\n" +
        "const getContractAt = async (contractName : string, address : string, signer : ethers.Signer) => {\n" +
        "\tconst artifactsPath = `browser/contracts/artifacts/${contractName}.json`\n" +
        "\tconst metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))\n" +
        "\tconst contract = new ethers.Contract(address, metadata.abi, signer)\n" +
        "\treturn contract\n" +
        "}\n\n" +
        "(async () => {\n" +
        "\ttry {\n" +
        "\t\tconst signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner()\n" +
        this.script.map(str => { return "\t\t" + str + "\n" }).join("") +
        "\t} catch (e) {\n" +
        "\t\tconsole.log(e.message)\n" +
        "\t}\n" +
        "})()"
      console.log(result)
    }

  }

  addItem(transactionItem: TransactionItem) {
    if (transactionItem.transactionInfo) {
      if (transactionItem.transactionInfo.transactionType === TransactionInfoType.CreateContract) {
        const contractVar = "contract" + (++this.contractId)
        const newTransaction = {
          ...transactionItem.transactionInfo,
          contractVar,
        }
        this.transactionList.push(newTransaction)
        if (transactionItem.result) {
          const address = transactionItem.result.contractAddress
          this.contractMap.set(address, contractVar)
        }
        if (this.isTest) {
          this.script.push("const _" + contractVar + "Factory = await ethers.getContractFactory(\"" + newTransaction.contractName + "\")")
        } else {
          this.script.push("const _" + contractVar + "Factory = await getContractFactory(\"" + newTransaction.contractName + "\", signer)")
        }

        this.script.push("const " + contractVar + " = await _" + contractVar + "Factory.deploy(")
        transactionItem.transactionInfo.args.forEach((arg: any) => {
          this.script.push("\t" + this.argToString(arg) + ",")
        });
        this.script.push(")")
        this.script.push("await " + contractVar + ".deployed()")
      } else if (transactionItem.transactionInfo.transactionType === TransactionInfoType.ModifyContract) {
        this.script.push(
          "console.log(\"" +
          addslashes(transactionItem.transactionInfo.contractName) +
          " => " +
          addslashes(transactionItem.transactionInfo.functionName) +
          "\")")
        if (transactionItem.transactionInfo.contractAddress) {
          let contractVar
          if (transactionItem.transactionInfo.contractName === "PlayGame") {
            contractVar = this.nextPlayGameVar
          } else {
            contractVar = this.contractMap.get(transactionItem.transactionInfo.contractAddress)
          }
          if (!contractVar) {
            const address = transactionItem.transactionInfo.contractAddress
            const contractName = transactionItem.transactionInfo.contractName
            contractVar = "contract" + (++this.contractId)
            if (this.isTest) {
              this.script.push("const " + contractVar + " = await getContractAt(\"" + contractName + "\", \"" + address + "\")")
            } else {
              this.script.push("const " + contractVar + " = await getContractAt(\"" + contractName + "\", \"" + address + "\", signer)")
            }

            this.contractMap.set(address, contractVar)
          }
          const newTransaction = {
            ...transactionItem.transactionInfo,
            contractVar,
          }
          this.transactionList.push(newTransaction)
        }

      }
    }
  }
}
