import type {FunctionComponent} from "react";
import Mobile, {type MobileProps} from "./Mobile";

export interface MobileListProps {
    mobiles: MobileProps[],
}

const MobileList: FunctionComponent<MobileListProps> = ({mobiles}) => {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {mobiles.map((mobile) => <Mobile {...mobile}/>)}
        </div>
    );
};

export default MobileList;
