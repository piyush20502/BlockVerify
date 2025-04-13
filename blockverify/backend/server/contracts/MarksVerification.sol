// server/contracts/MarksVerification.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MarksVerification is Ownable {
    // Mapping from student IDs to document hashes
    mapping(string => bytes32) private documentHashes;
    
    // Events
    event DocumentHashPublished(string indexed documentId, bytes32 documentHash);
    event DocumentVerified(string indexed documentId, bool isValid);
    
    // Publish a document hash to the blockchain
    function publishMarksheetHash(string memory _documentId, bytes32 _hash) public {
        require(bytes(_documentId).length > 0, "Document ID cannot be empty");
        require(_hash != bytes32(0), "Hash cannot be empty");
        
        documentHashes[_documentId] = _hash;
        
        emit DocumentHashPublished(_documentId, _hash);
    }
    
    // Verify a document against its stored hash
// In MarksVerification.sol
function verifyMarksheet(string memory _documentId, bytes32 _hash) public view returns (uint8) {
    require(bytes(_documentId).length > 0, "Document ID cannot be empty");
    
    bytes32 storedHash = documentHashes[_documentId];
    
    if (storedHash == bytes32(0)) {
        return 0; // Document not found
    } else if (storedHash == _hash) {
        return 2; // Exact match
    } else {
        return 1; // Document exists but hash doesn't match
    }
}

    
    // Get the hash for a specific document ID (admin only)
    function getDocumentHash(string memory _documentId) public view onlyOwner returns (bytes32) {
        return documentHashes[_documentId];
    }
}