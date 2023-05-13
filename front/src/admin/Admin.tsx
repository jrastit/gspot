import {Button} from "react-bootstrap";
import type {FunctionComponent} from "react";
import {useState} from 'react';
import type {MobileProps} from "./Mobile";
import MobileList from "./MobileList";
import {produce} from "immer"

const Admin: FunctionComponent = () => {
    const [mobiles, setMobiles] = useState<MobileProps[]>([
        {name: 'mobile1'},
        {name: 'mobile2'}
    ]);

    const addMobile = () => {
        const nextState = produce(mobiles, (draft) => {
            draft.push({name: `mobile${mobiles.length + 1}`})
        })
        setMobiles(nextState);
    };

    return (
        <div>
            <MobileList mobiles={mobiles}/>
            <Button variant="primary" onClick={addMobile}>Add mobile</Button>
        </div>
    );
};

export default Admin;
