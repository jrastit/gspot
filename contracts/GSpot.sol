pragma solidity ^0.8.0;

struct Ip {
    uint256 stake;
    bool enable;
    address payable owner;
}

contract GSpot {

    constructor() {
        owner = msg.sender;
    }

    ////////////////////////////////////// Owner ///////////////////////////////////////////
    //Owner of the contract
	address public owner;

	modifier isOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function setOwner(address _owner) public isOwner() {
		owner = _owner;
	}

    ////////////////////////////////////// Antenna ///////////////////////////////////////////
    //Activate antenna
    mapping(string => bool) private running;

    function getRunning(string calldata antenna) public view returns(bool){
        return running[antenna];
    }

    function setRunning(string calldata antenna, bool state) public isOwner() {
		running[antenna] = state;
	}

    ////////////////////////////////////// Ip ///////////////////////////////////////////
    //Activate global
    mapping(string => Ip) private ip_map;

    function getIp(string calldata ip) public view returns(Ip memory){
        return ip_map[ip];
    }

    function setIp(string calldata ip, bool enable) public isOwner() {
        ip_map[ip].enable = enable;
        ip_map[ip].stake = 10;
	}

    function bill(string calldata ip, uint256 amount) public isOwner() {
        if (amount < ip_map[ip].stake){
            ip_map[ip].stake -= amount;
            userStake -= amount;
            ownerStake += amount;
        } else {
            userStake -= ip_map[ip].stake;
            ownerStake += ip_map[ip].stake;
            ip_map[ip].stake = 0;
            ip_map[ip].enable = false;

        }
    }

    function stake(string calldata ip) public payable {
        if (ip_map[ip].owner != address(0)){
            assert(ip_map[ip].owner == msg.sender);
        } else {
            ip_map[ip].owner = payable(msg.sender);
        }
        ip_map[ip].stake += msg.value;
        userStake += msg.value;
        if (ip_map[ip].stake > 0){
            ip_map[ip].enable = true;
        }
    }

    ////////////////////////////////////// Stake ///////////////////////////////////////////
    //Activate global
    uint256 public userStake;
    uint256 public ownerStake;

    function withdraw(address payable to) public isOwner() {
        to.transfer(ownerStake);
        ownerStake = 0;
    }

}
