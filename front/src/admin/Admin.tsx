import type {FunctionComponent} from "react";
import {useEffect, useState} from 'react';
import MobileList from "./MobileList";

export interface MobileInfo {
    ip: string,
    enable: boolean,
    stake: string,
}

const Admin: FunctionComponent = () => {
    const [mobiles, setMobiles] = useState<MobileInfo[]>([]);

    useEffect(() => {
        const refresh = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/ip');
                if (response.status === 200) {
                    const result: { ip_list: MobileInfo[] } = await response.json();
                    setMobiles(result.ip_list);
                }
            } catch (e) {
                console.error(e);
            }
            setTimeout(refresh, 500);
        };
        refresh();
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
