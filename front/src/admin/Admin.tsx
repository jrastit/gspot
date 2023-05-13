import Button from '@mui/material/Button';
import type {FunctionComponent} from "react";
import {useState} from 'react';
import {MobileProps} from "./Mobile";
import MobileList from "./MobileList";

const Admin: FunctionComponent = () => {
    const [mobiles] = useState<MobileProps[]>([
        {name: 'mobile1'},
        {name: 'mobile2'}
    ]);

    return (
        <div>
            <MobileList mobiles={mobiles}/>
            <Button variant="contained">Add mobile</Button>
        </div>
    );
};

export default Admin;
