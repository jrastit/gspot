import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";
import abi from '../contract/GSpot.json';
import {ExternalProvider} from "@ethersproject/providers/src.ts/web3-provider";
import {BigNumber} from "@ethersproject/bignumber";
import {formatEther} from "ethers/lib/utils";
import {Button} from "react-bootstrap";

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
        const fetchAddres = async () => {
            try {
                const response = await fetch('api/ip');
                if (response.status === 200) {
                    const result: { address: string } = await response.json();
                    setContactAddress(result.address);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchAddres();
    }, []);

    const contract = useMemo(() => contractAddress ? new ethers.Contract(contractAddress, abi as unknown as string, provider) : undefined, [contractAddress]);

    const [balance, setBalance] = useState<BigNumber>();
    useEffect(() => {
        (async () => setBalance(await provider.getBalance(account)))();
    }, [account])

    return (
        <>
            <div>Connected account {account} on chain ID {chainId} balance {`${formatEther(balance ?? 0)}`}</div>
            <Button
                disabled={contract === undefined}
                onClick={() => {
                    if (contract) {
                        const daiWithSigner = contract.connect(signer);
                        const dai = ethers.utils.parseUnits("0.1", 18);
                        const tx = daiWithSigner.transfer(account, dai);
                        console.log(tx);
                    }
                }}>
                Stack 0.1
            </Button>
        </>
    );
}

export default ConnectedUser;