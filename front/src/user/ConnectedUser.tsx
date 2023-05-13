import {FunctionComponent, useEffect, useState} from "react";
import {ethers, formatEther} from "ethers";
import {Eip1193Provider} from "ethers/src.ts/providers/provider-browser";

interface ConnectedUser {
    chainId: string,
    account: string,
}

const provider = new ethers.BrowserProvider((window as unknown as { ethereum: Eip1193Provider }).ethereum);
console.log(provider);

const ConnectedUser: FunctionComponent<ConnectedUser> = ({chainId, account}) => {
    const [balance, setBalance] = useState<bigint>();
    useEffect(() => {
        (async () => setBalance(await provider.getBalance(account)))();
    }, [account])

    return (
        <div>Connected account {account} on chain ID {chainId} balance {`${formatEther(balance ?? 0)}`}</div>
    );
}

export default ConnectedUser;