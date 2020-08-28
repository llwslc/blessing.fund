pragma solidity ^0.5.0;

import "./BaseRoles.sol";

contract Broker is BaseRoles {
    mapping(address => string) public wealthCode; // 某地址的推荐码
    mapping(string => address) public codeBroker; // 某推荐码的地址
    mapping(address => address) public myBroker; // 某地址的推荐人
    mapping(address => string) public aceInTheHole; // 某地址的开奖种子
    bytes32 public jackpot; // 公共开奖种子

    constructor() public {
        jackpot = keccak256(abi.encodePacked(block.coinbase, block.timestamp));
    }

    function() external payable {}

    // 设置推荐码
    function firstStepsToWealth(string memory _code) public returns (bool) {
        require(bytes(wealthCode[msg.sender]).length == 0, "Already set");
        uint256 codeLen = bytes(_code).length;
        require(codeLen >= 4 && codeLen <= 16, "Length error");

        address tmp = codeBroker[_code];
        require(tmp == address(0), "Code already exists");

        wealthCode[msg.sender] = _code;
        codeBroker[_code] = msg.sender;

        return true;
    }

    // 设置推荐人
    function strikeItRich(string memory _code) public returns (bool) {
        address broker = codeBroker[_code];
        require(broker != address(0), "Code does not exist");
        require(broker != msg.sender, "Here is your referral code");

        address tmp = myBroker[msg.sender];
        require(tmp == address(0), "Referrer is set");

        myBroker[msg.sender] = broker;

        return true;
    }

    // 设置开奖种子
    function kissMyAce(string memory _code) public returns (bool) {
        uint256 codeLen = bytes(_code).length;
        require(codeLen >= 4 && codeLen <= 16, "Length error");
        aceInTheHole[msg.sender] = _code;

        return true;
    }

    // 获取开奖种子
    function chickenDinner(address _winner) public view returns (bytes32) {
        string memory ace = aceInTheHole[_winner];
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
