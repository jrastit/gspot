import type {FunctionComponent} from "react";
import Mobile from "./Mobile";
import type {MobileInfo} from "./Admin";

interface MobileListProps {
    mobiles: MobileInfo[],
}

const MobileList: FunctionComponent<MobileListProps> = ({mobiles}) => {
    return (
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {mobiles.map((mobileInfo) => <Mobile key={mobileInfo.ip} info={mobileInfo}/>)}
        </div>
    );
};

export default MobileList;
