import type {FunctionComponent} from "react";
import Mobile, {type MobileProps} from "./Mobile";

export interface MobileListProps {
    mobiles: MobileProps[],
}

const MobileList: FunctionComponent<MobileListProps> = ({mobiles}) => {
    return (<>
        {mobiles.map((mobile) => <Mobile {...mobile}/>)}
    </>);
};

export default MobileList;
