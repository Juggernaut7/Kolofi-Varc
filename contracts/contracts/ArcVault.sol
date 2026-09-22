// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArcVault
 * @notice Personal USDC savings vaults on Arc.
 * @dev Uses Arc native USDC (18 decimals) via msg.value / native transfers.
 *      Gas on Arc is also paid in USDC, so users only need one asset.
 */
contract ArcVault {
    struct Vault {
        address owner;
        string name;
        uint256 goalAmount;
        uint256 balance;
        uint256 unlockTime;
        bool closed;
        uint256 createdAt;
    }

    uint256 public nextVaultId = 1;
    mapping(uint256 => Vault) public vaults;
    mapping(address => uint256[]) private _userVaultIds;

    event VaultCreated(
        uint256 indexed vaultId,
        address indexed owner,
        string name,
        uint256 goalAmount,
        uint256 unlockTime
    );
    event Deposited(uint256 indexed vaultId, address indexed from, uint256 amount);
    event Withdrawn(uint256 indexed vaultId, address indexed to, uint256 amount);

    error NotOwner();
    error VaultClosed();
    error InvalidGoal();
    error InvalidUnlock();
    error ZeroDeposit();
    error StillLocked();
    error NothingToWithdraw();
    error TransferFailed();

    function createVault(
        string calldata name,
        uint256 goalAmount,
        uint256 unlockTime
    ) external returns (uint256 vaultId) {
        if (goalAmount == 0) revert InvalidGoal();
        if (unlockTime <= block.timestamp) revert InvalidUnlock();

        vaultId = nextVaultId++;
        vaults[vaultId] = Vault({
            owner: msg.sender,
            name: name,
            goalAmount: goalAmount,
            balance: 0,
            unlockTime: unlockTime,
            closed: false,
            createdAt: block.timestamp
        });
        _userVaultIds[msg.sender].push(vaultId);

        emit VaultCreated(vaultId, msg.sender, name, goalAmount, unlockTime);
    }

    function deposit(uint256 vaultId) external payable {
        Vault storage vault = vaults[vaultId];
        if (vault.owner == address(0)) revert NotOwner();
        if (vault.owner != msg.sender) revert NotOwner();
        if (vault.closed) revert VaultClosed();
        if (msg.value == 0) revert ZeroDeposit();

        vault.balance += msg.value;
        emit Deposited(vaultId, msg.sender, msg.value);
    }

    /// @notice Withdraw the full balance once unlock time is reached or goal is met.
    function withdraw(uint256 vaultId) external {
        Vault storage vault = vaults[vaultId];
        if (vault.owner != msg.sender) revert NotOwner();
        if (vault.closed) revert VaultClosed();
        if (vault.balance == 0) revert NothingToWithdraw();

        bool unlocked = block.timestamp >= vault.unlockTime;
        bool goalMet = vault.balance >= vault.goalAmount;
        if (!unlocked && !goalMet) revert StillLocked();

        uint256 amount = vault.balance;
        vault.balance = 0;
        vault.closed = true;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        if (!ok) revert TransferFailed();

        emit Withdrawn(vaultId, msg.sender, amount);
    }

    function getVault(uint256 vaultId) external view returns (Vault memory) {
        return vaults[vaultId];
    }

    function getUserVaultIds(address user) external view returns (uint256[] memory) {
        return _userVaultIds[user];
    }

    function isWithdrawable(uint256 vaultId) external view returns (bool) {
        Vault storage vault = vaults[vaultId];
        if (vault.closed || vault.balance == 0) return false;
        return block.timestamp >= vault.unlockTime || vault.balance >= vault.goalAmount;
    }
}
