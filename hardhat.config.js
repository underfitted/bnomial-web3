require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

const { MUMBAI_API_URL, POLYGON_API_URL, PRIVATE_KEY, POLYSCAN_KEY } = process.env;

module.exports = {
    solidity: "0.8.10",  
    mocha: {
    timeout: 40000
    },
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
