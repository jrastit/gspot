import {Button} from "react-bootstrap";
import type {FunctionComponent} from "react";
import {useState} from 'react';
import type {MobileProps} from "./Mobile";
import MobileList from "./MobileList";

const Admin: FunctionComponent = () => {
    const [mobiles] = useState<MobileProps[]>([
        {name: 'mobile1'},
        {name: 'mobile2'}
    ]);

    return (
        <div>
            <MobileList mobiles={mobiles}/>
            <Button variant="primary">Add mobile</Button>
        </div>
    );
};

export default Admin;
