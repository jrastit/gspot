import type {FunctionComponent} from "react";

export interface MobileProps {
    name: string,
}

const Mobile: FunctionComponent<MobileProps> = ({name}) => {
    return <div>{name}</div>
};

export default Mobile;
