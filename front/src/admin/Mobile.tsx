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
                Owner: {`${info.owner?.substring(0, 6)}...`}<br/>
                Stake: {info.stake}<br/>
                Billed: {info.totalBilled}<br/>
                Data size: {info.totalSize}<br/>
            </Card.Text>
        </Card.Body>
    </Card>
};

export default Mobile;
