import type {FunctionComponent} from "react";
import {Card} from "react-bootstrap";
import {MobileInfo} from "./Admin";

interface MobileProps {
    info: MobileInfo,
}

const Mobile: FunctionComponent<MobileProps> = ({info}) => {
    return <Card style={{width: '18rem'}}>
        <Card.Body>
            <Card.Title>{info.enable ? '✅' : '❌'} {info.ip}</Card.Title>
            <Card.Text>
                Stake: {info.stake}<br/>
                Owner: {info.owner}
            </Card.Text>
        </Card.Body>
    </Card>
};

export default Mobile;
