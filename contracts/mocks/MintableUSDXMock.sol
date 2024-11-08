// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {USDXMock} from "./USDXMock.sol";
import { IOFTMinterBurner } from "../interfaces/IOFTMinterBurner.sol";

/**
 * @title MintableUSDXMock
 * @dev MintableUSDXMock is a USDXMock with additional burn functionality, to mock non-Ethereum instances of USDX.
 * @dev WARNING: This is for testing purposes only, never rely on this contract in production.
 */
contract MintableUSDXMock is USDXMock, IOFTMinterBurner {
    constructor() USDXMock() {}

    function mint(address _to, uint256 _amount) public virtual override(USDXMock, IOFTMinterBurner) {
        _mint(_to, _amount);
    }

    // @dev This would have access protection in a production scenario.
    function burnFrom(address _from, uint256 _amount) public virtual override {
        _burn(_from, _amount);
    }
}