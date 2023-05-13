import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";
import {ExternalProvider} from "@ethersproject/providers/src.ts/web3-provider";
import {BigNumber} from "@ethersproject/bignumber";
import {formatEther} from "ethers/lib/utils";

interface ConnectedUser {
    chainId: string,
    account: string,
}

const ConnectedUser: FunctionComponent<ConnectedUser> = ({chainId, account}) => {
    const provider = useMemo(() => new ethers.providers.Web3Provider((window as unknown as {
        ethereum: ExternalProvider
    }).ethereum), []);

    const [balance, setBalance] = useState<BigNumber>();
    useEffect(() => {
        (async () => setBalance(await provider.getBalance(account)))();
    }, [account])

    return (
        <div>Connected account {account} on chain ID {chainId} balance {`${formatEther(balance ?? 0)}`}</div>
    );
}

export default ConnectedUser;
