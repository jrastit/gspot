import type {FunctionComponent} from 'react';
import {useMetaMask} from 'metamask-react';
import {Button} from "react-bootstrap";


const User: FunctionComponent = () => {
    const {status, connect, account, chainId} = useMetaMask();

    switch (status) {
        case 'initializing':
            return <div>Synchronisation with MetaMask ongoing...</div>;
        case 'unavailable':
            return <div>MetaMask not available :(</div>;
        case 'notConnected':
            return <Button variant="primary" onClick={connect}>Connect to MetaMask</Button>;
        case 'connecting':
            return <Button variant="primary" disabled>Connecting...</Button>;
        case 'connected':
            return <div>Connected account {account} on chain ID {chainId}</div>;
        default:
            return null;
    }
}

export default User;
