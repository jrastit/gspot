
type NetworkType = {
  name: string
  url: string
  chainId: number
  gameContract?: string
  blockExplorerTxPrefix?: string
  faucet?: string
  faucetAmount?: number
  entityRegistryAddress?: string
  tokenName?: string
  contractDomainChainlink?: {
    linkAddress: string
    oracle: string
    jobId: string
  }
  timeBetweenRequest?: number
  retry?: number
  refreshBalance?: number
  host?: string
  default?: boolean,
  warningBalance?: number,
}

export type { NetworkType }
