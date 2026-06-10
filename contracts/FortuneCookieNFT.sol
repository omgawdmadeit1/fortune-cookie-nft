// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Crypto Fortune Cookie NFT
/// @notice Signature-gated ERC-721 minting for a limited 10-edition drop.
/// The project owner signs token vouchers off-chain; collectors redeem on-chain and pay only their own mint gas.
/// First-come, first-served per tokenId.
contract FortuneCookieNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public signer;
    uint256 public constant MAX_SUPPLY = 10;
    uint256 public totalMinted;

    mapping(uint256 => bool) public minted;

    event SignerUpdated(address indexed oldSigner, address indexed newSigner);
    event FortuneCookieMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(address initialSigner)
        ERC721("Crypto Fortune Cookie", "CFC")
        Ownable(msg.sender)
    {
        require(initialSigner != address(0), "Signer required");
        signer = initialSigner;
    }

    /// @notice Update the trusted voucher signer (e.g. key rotation). Only owner.
    function setSigner(address newSigner) external onlyOwner {
        require(newSigner != address(0), "Signer required");
        address oldSigner = signer;
        signer = newSigner;
        emit SignerUpdated(oldSigner, newSigner);
    }

    /// @notice Redeem a signed voucher. Mints to the caller (msg.sender).
    /// @dev Signature must be over (contract, chainId, tokenId, tokenURI) using the trusted signer.
    function mintWithSignature(
        uint256 tokenId,
        string calldata tokenURI,
        bytes calldata signature
    ) external nonReentrant {
        require(!minted[tokenId], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Supply exhausted");
        require(_verifyVoucher(tokenId, tokenURI, signature), "Invalid signature");

        minted[tokenId] = true;
        totalMinted += 1;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit FortuneCookieMinted(msg.sender, tokenId, tokenURI);
    }

    /// @notice Owner can mint directly (e.g. for giveaways or remaining after claim period).
    function ownerMint(address to, uint256 tokenId, string calldata tokenURI) external onlyOwner {
        require(!minted[tokenId], "Already minted");
        require(totalMinted < MAX_SUPPLY, "Supply exhausted");

        minted[tokenId] = true;
        totalMinted += 1;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit FortuneCookieMinted(to, tokenId, tokenURI);
    }

    function verifyVoucher(
        uint256 tokenId,
        string calldata tokenURI,
        bytes calldata signature
    ) external view returns (bool) {
        return _verifyVoucher(tokenId, tokenURI, signature);
    }

    function _verifyVoucher(
        uint256 tokenId,
        string calldata tokenURI,
        bytes calldata signature
    ) internal view returns (bool) {
        // Matches the signing in sign scripts: contract + chainId + tokenId + tokenURI
        bytes32 hash = keccak256(abi.encodePacked(address(this), block.chainid, tokenId, tokenURI))
            .toEthSignedMessageHash();

        return hash.recover(signature) == signer;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "";
    }
}