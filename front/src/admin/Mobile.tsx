import type {FunctionComponent} from "react";
import {Button, Card} from "react-bootstrap";

export interface MobileProps {
    name: string,
}

const Mobile: FunctionComponent<MobileProps> = ({name}) => {
    return <Card style={{ width: '18rem' }}>
        <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Button variant="primary">Disconnect</Button>
        </Card.Body>
    </Card>
};

export default Mobile;
