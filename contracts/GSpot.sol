pragma solidity ^0.8.0;

contract GSpot {

    constructor() {
        owner = msg.sender;
        running = false;
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

    ////////////////////////////////////// Global ///////////////////////////////////////////
    //Activate global
    bool public running;

    function setRunning() public isOwner() {
		running = !running;
	}
}
