import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";
import {ExternalProvider} from "@ethersproject/providers/src.ts/web3-provider";
import {BigNumber} from "@ethersproject/bignumber";
import {formatEther} from "ethers/lib/utils";
import {Button} from "react-bootstrap";
import {getContractGSpot} from '../contract/GSpot'

interface ConnectedUser {
    chainId: string,
    account: string,
}

const ConnectedUser: FunctionComponent<ConnectedUser> = ({chainId, account}) => {
    const provider = useMemo(() => new ethers.providers.Web3Provider((window as unknown as {
        ethereum: ExternalProvider
    }).ethereum), []);
    const signer = useMemo(() => provider.getSigner(), []);
    const [contractAddress, setContactAddress] = useState<string>();
    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await fetch('/api/contract/');
                if (response.status === 200) {
                    const result: { address: string } = await response.json();
                    console.log(result);
                    setContactAddress(result.address);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchAddress();
    }, []);

    const contract = useMemo(() => contractAddress ? getContractGSpot(contractAddress, signer) : undefined, [contractAddress]);

    const [balance, setBalance] = useState<BigNumber>();
    useEffect(() => {
        (async () => setBalance(await provider.getBalance(account)))();
    }, [account])

    return (
        <>
            <div>Connected account {account} on chain ID {chainId} balance {`${formatEther(balance ?? 0)}`}</div>
            <Button
                disabled={contract === undefined}
                onClick={async () => {
                    if (contract) {
                        const tx = await contract.stake('192.168.1.130', {value: "10"});
                        console.log(tx);
                    }
                }}>
                Stack 10
            </Button>
        </>
    );
}

export default ConnectedUser;
