// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;


// deployed to goerli to this adderess BuyMEACoffee deployed to 0x9cA7fF0B23557FcD4D7cB99966d2b9feAE192e57
contract BuyMeACoffee {


//event Memo
event NewMemo (
address from,
uint256 timestamp,
string name,
string message
);


//Memo struct
struct Memo {
    address from;
    uint256 timestamp;
    string name;
    string message;
}

//list of all memos sent by friends
Memo[] memos;
//address of contract deployer
address payable owner;

//only run when deployed
//deploy logic
constructor(){
    owner = payable(msg.sender);
}

/** 
* @dev buy a coffee for contract owner
*@param _name name of coffee buyer
*@param _message a nice message from the coffee buyer
*/

function buyCoffee(string memory _name,string memory _message) public payable{

require(msg.value > 0 , "can't send coffee with 0 ether");

memos.push(Memo(
    msg.sender,
    block.timestamp,
    _name,
    _message
));

emit NewMemo(msg.sender, block.timestamp, _name, _message);

}

// send the stored entire balanace in this contract to owner
function withdrawTips() public {
    require(owner.send(address(this).balance));

}

//retreive all memos recieved and stored on the blockchain
function getMemos() public view returns(Memo[] memory){
    return memos;
}

}



