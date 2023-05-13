import type {FunctionComponent} from "react";
import {useEffect, useState} from 'react';
import MobileList from "./MobileList";
import {Card} from "react-bootstrap";

export interface MobileInfo {
    ip: string,
    enable: boolean,
    stake: string,
    owner: string,
}

interface ApiResult {
    owner_stake: string,
    user_stake: string,
    ip_list: MobileInfo[],
}

const Admin: FunctionComponent = () => {
    const [apiResult, setApiResult] = useState<ApiResult>();

    useEffect(() => {
        let running = true;
        const refresh = async () => {
            if (running) {
                try {
                    const response = await fetch('api/ip');
                    if (response.status === 200) {
                        const result: ApiResult = await response.json();
                        setApiResult(result);
                    }
                } catch (e) {
                    console.error(e);
                }
                setTimeout(refresh, 1000);
            }
        };
        refresh();
        return () => {
            running = false;
        }
    }, []);


    return (
        <>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Card.Title>Owner stack</Card.Title>
                        <Card.Text>{apiResult?.owner_stake ?? '0'}</Card.Text>
                    </Card.Body>
                </Card>
                <Card style={{width: '18rem'}}>
                    <Card.Body>
                        <Card.Title>User stack</Card.Title>
                        <Card.Text>{apiResult?.user_stake ?? '0'}</Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <p/>
            <h3>Registered mobiles</h3>
            <div>
                <MobileList mobiles={apiResult?.ip_list ?? []}/>
            </div>
        </>
    );
};

export default Admin;
