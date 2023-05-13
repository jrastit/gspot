import type {FunctionComponent} from 'react';
import {useState} from 'react';
import {AuthType, SismoConnectButton, SismoConnectClientConfig} from '@sismo-core/sismo-connect-react';


const sismoConnectConfig: SismoConnectClientConfig = {
    appId: '0xc549efb14f82dc59f3b98405e3acaa33',
    devMode: {
        enabled: true,
    },
};

export const signMessage = (account: string) => `Hello ${account}`;
const UserSismo: FunctionComponent = () => {
    const [responseBytes, setResponseBytes] = useState<string>('');
    const [account] = useState<`0x${string}`>(
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
    );

    return (
        <>
            <div>{responseBytes}</div>
            <div>
                <SismoConnectButton
                    // the client config created
                    config={sismoConnectConfig}
                    // the auth request we want to make
                    // here we want the proof of a Sismo Vault ownership from our users
                    auths={[{authType: AuthType.VAULT}]}
                    // we ask the user to sign a message
                    // it will be used onchain to prevent front running
                    signature={{message: signMessage(account)}}
                    // onResponseBytes calls a 'setResponse' function
                    // with the responseBytes returned by the Sismo Vault
                    onResponseBytes={(responseBytes: string) => setResponseBytes(responseBytes)}
                    // Some text to display on the button
                    text={'Connect with Sismo'}
                />
            </div>
        </>
    );
}

export default UserSismo;
