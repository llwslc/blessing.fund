pragma solidity ^0.5.0;

interface IERC20 {
    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount)
        external
        returns (bool);
}

contract BaseRoles {
    /**
     * @dev The addresses of the accounts that can execute actions within each roles.
     */
    address public ceoAddress;
    address public cfoAddress;
    address public cooAddress;

    /**
     * @dev Keeps track whether the contract is paused. When that is true, most actions are blocked.
     */
    bool public paused = false;

    /**
     * @dev The addresses of the contracts that can execute actions.
     */
    mapping(address => bool) public safeContracts;

    /**
     * @dev Emitted when the role is changed by old role (`account`).
     */
    event CEORoleEvent(address account);
    event CFORoleEvent(address account);
    event COORoleEvent(address account);

    /**
     * @dev Emitted when the pause is changed by a pauser (`account`).
     */
    event PausedEvent(bool indexed state, address account);

    /**
     * @dev Emitted when the safe contract is changed by a pauser (`account`).
     */
    event SafeContractEvent(
        bool indexed state,
        address safeContract,
        address account
    );

    /**
     * @dev Access modifier for CEO-only functionality.
     */
    modifier onlyCEO() {
        require(msg.sender == ceoAddress, "CEO: Permission denied");
        _;
    }

    /**
     * @dev Access modifier for CFO functionality.
     */
    modifier onlyCFO() {
        require(
            msg.sender == cfoAddress || msg.sender == ceoAddress,
            "CFO/CEO: Permission denied"
        );
        _;
    }

    /**
     * @dev Access modifier for COO functionality.
     */
    modifier onlyCOO() {
        require(
            msg.sender == cooAddress || msg.sender == ceoAddress,
            "COO/CEO: Permission denied"
        );
        _;
    }

    /**
     * @dev Access modifier for CEO/CFO/COO functionality.
     */
    modifier onlyCLevel() {
        require(
            msg.sender == ceoAddress ||
                msg.sender == cfoAddress ||
                msg.sender == cooAddress,
            "CEO/CFO/COO: Permission denied"
        );
        _;
    }

    /**
     * @dev Assigns a new address to act as the CEO. Only available to the current CEO.
     * @param _newCEO The address of the new CEO.
     */
    function setCEO(address _newCEO) external onlyCEO returns (bool) {
        require(
            _newCEO != address(0) && _newCEO != ceoAddress,
            "SetCEO: Same address"
        );
        ceoAddress = _newCEO;
        emit CEORoleEvent(_newCEO);
        return true;
    }

    /**
     * @dev Assigns a new address to act as the CFO. Only available to the current CEO.
     * @param _newCFO The address of the new CFO.
     */
    function setCFO(address _newCFO) external onlyCEO returns (bool) {
        require(
            _newCFO != address(0) && _newCFO != cfoAddress,
            "SetCFO: Same address"
        );
        cfoAddress = _newCFO;
        emit CFORoleEvent(_newCFO);
        return true;
    }

    /**
     * @dev Assigns a new address to act as the COO. Only available to the current CEO.
     * @param _newCOO The address of the new COO.
     */
    function setCOO(address _newCOO) external onlyCEO returns (bool) {
        require(
            _newCOO != address(0) && _newCOO != cooAddress,
            "SetCOO: Same address"
        );
        cooAddress = _newCOO;
        emit COORoleEvent(_newCOO);
        return true;
    }

    /**
     * @dev Modifier to allow actions only when the contract IS NOT paused.
     */
    modifier whenNotPaused() {
        require(!paused, "Pausable: paused");
        _;
    }

    /**
     * @dev Modifier to allow actions only when the contract IS paused.
     */
    modifier whenPaused {
        require(paused, "Pausable: not paused");
        _;
    }

    /**
     * @dev Called by any "C-level" role to pause the contract. Used only when a bug or exploit is detected and we need to limit damage.
     */
    function pause() external onlyCLevel whenNotPaused returns (bool) {
        paused = true;
        emit PausedEvent(true, msg.sender);
        return true;
    }

    /**
     * @dev Unpauses the smart contract. Can only be called by the CEO, since one reason we may pause the contract is when CFO or COO accounts are compromised.
     * @notice This is public rather than external so it can be called by derived contracts.
     */
    function unpause() public onlyCEO whenPaused returns (bool) {
        paused = false;
        emit PausedEvent(false, msg.sender);
        return true;
    }

    /**
     * @dev Access modifier for safe contract functionality
     */
    modifier safeContract() {
        require(safeContracts[msg.sender], "Contract: Permission denied");
        _;
    }

    /**
     * @dev Add an address of the contracts that can execute actions.
     * @param _addr The address of the contract.
     */
    function addSafeContract(address _addr) external onlyCOO returns (bool) {
        safeContracts[_addr] = true;
        emit SafeContractEvent(true, _addr, msg.sender);
        return true;
    }

    /**
     * @dev Remove an address of the contracts that can execute actions.
     * @param _addr The address of the contract.
     */
    function removeSafeContract(address _addr) external onlyCOO returns (bool) {
        safeContracts[_addr] = false;
        emit SafeContractEvent(false, _addr, msg.sender);
        return true;
    }

    /**
     * @dev constructor
     */
    constructor() public {
        ceoAddress = msg.sender;
        cfoAddress = msg.sender;
        cooAddress = msg.sender;
    }

    /**
     * @dev Moves the amount of coins to msg.sender.
     * @param _amount Moves amount.
     */
    function withdrawCoin(uint256 _amount) external onlyCFO returns (bool) {
        require(
            _amount <= address(this).balance,
            "withdrawCoin: Not enough balance"
        );
        msg.sender.transfer(_amount);
        return true;
    }

    /**
     * @dev Moves the amount of tokens to msg.sender.
     * @param _token ERC20 token address.
     * @param _amount Moves amount.
     */
    function withdrawERC20(IERC20 _token, uint256 _amount)
        external
        onlyCFO
        returns (bool)
    {
        require(
            _amount <= _token.balanceOf(address(this)),
            "withdrawERC20: Not enough balance"
        );
        _token.transfer(msg.sender, _amount);
        return true;
    }
}
