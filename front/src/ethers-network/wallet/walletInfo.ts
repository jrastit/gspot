type WalletInfo = {
  type?: string
  name?: string
  address?: string
  balance: { balance: number | undefined, chainId: number }[]
}

export type { WalletInfo }
