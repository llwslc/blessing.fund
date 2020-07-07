pragma solidity ^0.5.0;

import "./BaseRoles.sol";

contract Broker is BaseRoles {
    mapping(address => string) public wealthCodeMap;
    mapping(string => address) public codeBrokerMap;
    mapping(address => address) public myBroker;
    mapping(address => string) public aceCodeMap;
    bytes32 public jackpot;

    constructor() public {
        jackpot = keccak256(abi.encodePacked(block.coinbase, block.timestamp));
    }

    function() external payable {}

    function firstStepsToWealth(string memory _code) public returns (bool) {
        require(bytes(wealthCodeMap[msg.sender]).length == 0, "Already set");
        uint256 codeLen = bytes(_code).length;
        require(codeLen >= 4 && codeLen <= 16, "Length error");

        address tmp = codeBrokerMap[_code];
        require(tmp == address(0), "Code already exists");

        wealthCodeMap[msg.sender] = _code;
        codeBrokerMap[_code] = msg.sender;

        return true;
    }

    function strikeItRich(string memory _code) public returns (bool) {
        address broker = codeBrokerMap[_code];
        require(broker != address(0), "Code does not exist");
        require(broker != msg.sender, "Here is your referral code");

        address tmp = myBroker[msg.sender];
        require(tmp == address(0), "Referrer is set");

        myBroker[msg.sender] = broker;

        return true;
    }

    function kissMyAce(string memory _code) public returns (bool) {
        uint256 codeLen = bytes(_code).length;
        require(codeLen >= 4 && codeLen <= 16, "Length error");
        aceCodeMap[msg.sender] = _code;

        return true;
    }

    function chickenDinner(address _winner) public view returns (bytes32) {
        string memory ace = aceCodeMap[_winner];
        if (bytes(ace).length != 0) {
            return keccak256(abi.encodePacked(ace));
        } else {
            return jackpot;
        }
    }

    function flexMyMuscles() public view returns (bytes32) {
        return chickenDinner(msg.sender);
    }
}
