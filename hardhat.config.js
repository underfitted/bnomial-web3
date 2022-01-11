require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const MUMBAI_API_URL = process.env.MUMBAI_API_URL || "";
const POLYGON_API_URL = process.env.POLYGON_API_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0000000000000000000000000000000000000000000000000000000000000000";
const POLYSCAN_KEY = process.env.POLYSCAN_KEY || "";

module.exports = {
    solidity: "0.8.2",
    networks: {
        hardhat: {},
        mumbai: {
            url: MUMBAI_API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
        polygon: {
            url: POLYGON_API_URL,
            accounts: [`0x${PRIVATE_KEY}`],
        },
    },
    etherscan: {
        apiKey: POLYSCAN_KEY,
    },
    gasReporter: {
        enabled: process.env.REPORT_GAS ? true : false,
    },
};
