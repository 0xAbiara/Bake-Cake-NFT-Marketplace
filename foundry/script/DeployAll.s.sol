// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {NftMarketplace} from "../src/NftMarketplace.sol";
import {CakeNft} from "../src/CakeNft.sol";
import {MoodNft} from "../src/MoodNft.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";

contract DeployAll is Script {
    function svgToImageURI(string memory svg) public pure returns (string memory) {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(bytes(string(abi.encodePacked(svg))));
        return string(abi.encodePacked(baseURL, svgBase64Encoded));
    }

    function run() external {
        vm.startBroadcast();
        
        // 1. Deploy Mock USDC
        MockUSDC usdc = new MockUSDC();
        console.log("USDC deployed at:", address(usdc));
        
        // 2. Deploy Marketplace
        NftMarketplace marketplace = new NftMarketplace(address(usdc));
        console.log("Marketplace deployed at:", address(marketplace));
        
        // 3. Deploy CakeNft
        CakeNft cakeNft = new CakeNft();
        console.log("CakeNft deployed at:", address(cakeNft));
        
        // 4. Deploy MoodNft
        string memory sadSvg = vm.readFile("./images/sad.svg");
        string memory happySvg = vm.readFile("./images/happy.svg");
        MoodNft moodNft = new MoodNft(
            svgToImageURI(sadSvg),
            svgToImageURI(happySvg)
        );
        console.log("MoodNft deployed at:", address(moodNft));
        
        vm.stopBroadcast();
        
        console.log("\n=== Deployment Summary ===");
        console.log("USDC:", address(usdc));
        console.log("Marketplace:", address(marketplace));
        console.log("CakeNft:", address(cakeNft));
        console.log("MoodNft:", address(moodNft));
    }
}