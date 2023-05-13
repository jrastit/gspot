import type {FunctionComponent} from "react";
import {useEffect, useState} from 'react';
import MobileList from "./MobileList";

export interface MobileInfo {
    ip: string,
    enable: boolean,
    stake: string,
    owner: string,
}

const Admin: FunctionComponent = () => {
    const [mobiles, setMobiles] = useState<MobileInfo[]>([]);

    useEffect(() => {
        let running = true;
        const refresh = async () => {
            if (running) {
                try {
                    const response = await fetch('http://localhost:5000/api/ip');
                    if (response.status === 200) {
                        const result: { ip_list: MobileInfo[] } = await response.json();
                        setMobiles(result.ip_list);
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
            <h1>Mobile phone list</h1>
            <div>
                <MobileList mobiles={mobiles}/>
            </div>
        </>
    );
};

export default Admin;
