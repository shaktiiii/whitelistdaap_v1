//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Whitelist {
  
  uint8 public maxWhiteListedAddress;
     
  mapping (address => bool) public whiteListedAddress;
  
  uint8 public numAddressesWhitelisted;

  constructor (uint8 _maxWhiteListedAddress) {
    maxWhiteListedAddress = _maxWhiteListedAddress; 
  }

  function addAddressToWhiteList() public {
    // modifier can be created for the below 2 lines. 
    require(!whiteListedAddress[msg.sender], "Sender has already been whitelisted"); 
    require(numAddressesWhitelisted <maxWhiteListedAddress, "More address can be listed, limit has been reached");
    
    whiteListedAddress[msg.sender] = true; 
    numAddressesWhitelisted += 1; 
            
  }


}

