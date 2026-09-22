// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArcCircle
 * @notice Rotating savings circle (ROSCA / Esusu / Ajo) on Arc using native USDC.
 * @dev Members join in order; that order is the payout lineup.
 *      Each round: every member contributes `contributionAmount`, then the
 *      member at index `currentRound` claims the pot.
 */
contract ArcCircle {
    struct Circle {
        address creator;
        string name;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 memberCount;
        uint256 currentRound;
        uint256 pot;
        bool active;
        bool started;
        uint256 createdAt;
    }

    uint256 public nextCircleId = 1;
    mapping(uint256 => Circle) public circles;
    mapping(uint256 => address[]) private _members;
    mapping(uint256 => mapping(address => bool)) private _isMember;
    mapping(uint256 => mapping(uint256 => mapping(address => bool))) private _contributed;
    mapping(uint256 => mapping(uint256 => uint256)) private _roundContributions;

    event CircleCreated(
        uint256 indexed circleId,
        address indexed creator,
        string name,
        uint256 contributionAmount,
        uint256 maxMembers
    );
    event MemberJoined(uint256 indexed circleId, address indexed member, uint256 position);
    event Contributed(uint256 indexed circleId, uint256 indexed round, address indexed member, uint256 amount);
    event PayoutClaimed(uint256 indexed circleId, uint256 indexed round, address indexed recipient, uint256 amount);
    event CircleCompleted(uint256 indexed circleId);

    error InvalidAmount();
    error InvalidMaxMembers();
    error CircleInactive();
    error CircleFull();
    error AlreadyMember();
    error NotMember();
    error CircleNotFull();
    error WrongContribution();
    error AlreadyContributed();
    error RoundIncomplete();
    error NotRecipient();
    error TransferFailed();
    error CircleNotFound();

    function createCircle(
        string calldata name,
        uint256 contributionAmount,
        uint256 maxMembers
    ) external returns (uint256 circleId) {
        if (contributionAmount == 0) revert InvalidAmount();
        if (maxMembers < 2 || maxMembers > 50) revert InvalidMaxMembers();

        circleId = nextCircleId++;
        circles[circleId] = Circle({
            creator: msg.sender,
            name: name,
            contributionAmount: contributionAmount,
            maxMembers: maxMembers,
            memberCount: 0,
            currentRound: 0,
            pot: 0,
            active: true,
            started: false,
            createdAt: block.timestamp
        });

        emit CircleCreated(circleId, msg.sender, name, contributionAmount, maxMembers);

        // Creator auto-joins as position 0 (first payout recipient after round 0 fills).
        _join(circleId, msg.sender);
    }

    function joinCircle(uint256 circleId) external {
        _join(circleId, msg.sender);
    }

    function contribute(uint256 circleId) external payable {
        Circle storage circle = circles[circleId];
        if (circle.creator == address(0)) revert CircleNotFound();
        if (!circle.active) revert CircleInactive();
        if (!_isMember[circleId][msg.sender]) revert NotMember();
        if (circle.memberCount < circle.maxMembers) revert CircleNotFull();
        if (msg.value != circle.contributionAmount) revert WrongContribution();

        uint256 round = circle.currentRound;
        if (_contributed[circleId][round][msg.sender]) revert AlreadyContributed();

        if (!circle.started) {
            circle.started = true;
        }

        _contributed[circleId][round][msg.sender] = true;
        _roundContributions[circleId][round] += 1;
        circle.pot += msg.value;

        emit Contributed(circleId, round, msg.sender, msg.value);
    }

    /// @notice Recipient for the current round claims once every member has contributed.
    function claimPayout(uint256 circleId) external {
        Circle storage circle = circles[circleId];
        if (!circle.active) revert CircleInactive();
        if (!_isMember[circleId][msg.sender]) revert NotMember();

        uint256 round = circle.currentRound;
        if (_roundContributions[circleId][round] < circle.memberCount) revert RoundIncomplete();

        address recipient = _members[circleId][round];
        if (msg.sender != recipient) revert NotRecipient();

        uint256 amount = circle.pot;
        circle.pot = 0;

        emit PayoutClaimed(circleId, round, recipient, amount);

        uint256 nextRound = round + 1;
        if (nextRound >= circle.memberCount) {
            circle.active = false;
            emit CircleCompleted(circleId);
        } else {
            circle.currentRound = nextRound;
        }

        (bool ok, ) = payable(recipient).call{value: amount}("");
        if (!ok) revert TransferFailed();
    }

    function getCircle(uint256 circleId) external view returns (Circle memory) {
        return circles[circleId];
    }

    function getMembers(uint256 circleId) external view returns (address[] memory) {
        return _members[circleId];
    }

    function hasContributed(
        uint256 circleId,
        uint256 round,
        address member
    ) external view returns (bool) {
        return _contributed[circleId][round][member];
    }

    function getRoundContributionCount(uint256 circleId, uint256 round) external view returns (uint256) {
        return _roundContributions[circleId][round];
    }

    function isMember(uint256 circleId, address account) external view returns (bool) {
        return _isMember[circleId][account];
    }

    function currentRecipient(uint256 circleId) external view returns (address) {
        Circle storage circle = circles[circleId];
        if (circle.memberCount == 0 || circle.currentRound >= circle.memberCount) {
            return address(0);
        }
        return _members[circleId][circle.currentRound];
    }

    function _join(uint256 circleId, address account) internal {
        Circle storage circle = circles[circleId];
        if (circle.creator == address(0)) revert CircleNotFound();
        if (!circle.active) revert CircleInactive();
        if (circle.started) revert CircleInactive();
        if (circle.memberCount >= circle.maxMembers) revert CircleFull();
        if (_isMember[circleId][account]) revert AlreadyMember();

        _isMember[circleId][account] = true;
        _members[circleId].push(account);
        circle.memberCount += 1;

        emit MemberJoined(circleId, account, circle.memberCount - 1);
    }
}
