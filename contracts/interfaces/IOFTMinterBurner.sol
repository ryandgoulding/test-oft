// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

interface IOFTMinterBurner {
    event MinterBurnerAdded(address indexed minterburner);
    event MinterBurnerRemoved(address indexed minterburner);
    event MintedBy(address indexed minterburner);
    event BurnedBy(address indexed minterburner);

    error NotMinterBurner(address minterburner);

    function mint(address _to, uint256 _amount) external;
    function burnFrom(address _account, uint256 _amount) external;
}