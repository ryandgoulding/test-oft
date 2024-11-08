// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title USDXMock
 *
 * @dev Mock contract to test USDX token.
 * @dev WARNING: This is for testing purposes only, never rely on this contract in production.
 */
contract USDXMock is ERC20 {
    constructor() ERC20("Test USD", "USDX") {}

    function mint(address _to, uint256 _amount) public virtual {
        _mint(_to, _amount);
    }
}
