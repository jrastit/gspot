pragma solidity ^0.8.0;

struct Ip {
    bool enable;
    uint256 stake;
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
	}

    function bill(string calldata ip, uint256 amount) public isOwner() {
        if (amount < ip_map[ip].stake)
            ip_map[ip].stake -= amount;
        else
            ip_map[ip].stake = 0;
            ip_map[ip].enable = false;
    }

    function stake(string calldata ip) public payable {
        ip_map[ip].stake += msg.value;
        if (ip_map[ip].stake > 0){
            ip_map[ip].enable = true;
        }
    }

}
