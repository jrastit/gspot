import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ethers} from "ethers";
import {ExternalProvider} from "@ethersproject/providers/src.ts/web3-provider";
import {BigNumber} from "@ethersproject/bignumber";
import {formatEther} from "ethers/lib/utils";
import {Button, Col, Form, Row} from "react-bootstrap";
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

    const [ip, setIp] = useState('192.168.1.130')
    const [amount, setAmount] = useState('10')

    return (
        <>
            <div>Connected account {account} on chain ID {chainId} balance {`${formatEther(balance ?? 0)}`}</div>
            <Form>
                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Form.Label column sm="2">
                        IP
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" onChange={({target}) => setIp(target.value)} defaultValue={ip}/>
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                    <Form.Label column sm="2">
                        Amount
                    </Form.Label>
                    <Col sm="10">
                        <Form.Control type="text" onChange={({target}) => setAmount(target.value)}
                                      defaultValue={amount}/>
                    </Col>
                </Form.Group>
            </Form>
            <Button
                disabled={contract === undefined}
                onClick={async () => {
                    if (contract) {
                        try {
                            const tx = await contract.stake(ip, {value: amount});
                            console.log(tx);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }}>
                Stack
            </Button>
        </>
    );
}

export default ConnectedUser;
