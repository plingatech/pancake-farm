import type { HardhatUserConfig, NetworkUserConfig } from 'hardhat/types'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@openzeppelin/hardhat-upgrades'
import '@typechain/hardhat'
import 'hardhat-watcher'
import 'dotenv/config'
import 'solidity-docgen'
require('dotenv').config({ path: require('find-config')('.env') })

const MTHREE_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.8.12',
  settings: {
    // evmVersion: 'default',
    optimizer: {
      enabled: true,
      runs: 10000000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const MONE_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.8.17',
  settings: {
    // evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 200,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const LOWEST_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.8.19',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 1_000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const NORMAL_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.6.12',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 200,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const FN_OPTIMIZER_COMPILER_SETTINGS = {
  version: '0.6.12',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 99999,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const DEFAULT_COMPILER_SETTINGS = {
  version: '0.6.12',
  settings: {
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 5000,
    },
    metadata: {
      bytecodeHash: 'none',
    },
  },
}

const bscTestnet: NetworkUserConfig = {
  url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  chainId: 97,
  accounts: [process.env.KEY_TESTNET!],
}

const bscMainnet: NetworkUserConfig = {
  url: 'https://bsc-dataseed.binance.org/',
  chainId: 56,
  accounts: [process.env.KEY_MAINNET!],
}

const goerli: NetworkUserConfig = {
  url: 'https://rpc.ankr.com/eth_goerli',
  chainId: 5,
  accounts: [process.env.KEY_GOERLI!],
}

const eth: NetworkUserConfig = {
  url: 'https://eth.llamarpc.com',
  chainId: 1,
  accounts: [process.env.KEY_ETH!],
}

const nexichain: NetworkUserConfig = {
  url: "https://rpc.chainv1.nexi.technology",
  chainId: 4242,
  accounts: [process.env.KEY_NEXI!],
}

const plgchain: NetworkUserConfig = {
  url: "http://127.0.0.1:8545",
  chainId: 242,
  accounts: [process.env.KEY_PLINGA!],
}

export default {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    ...(process.env.KEY_TESTNET && { bscTestnet }),
    ...(process.env.KEY_MAINNET && { bscMainnet }),
    ...(process.env.KEY_GOERLI && { goerli }),
    ...(process.env.KEY_ETH && { eth }),
    ...(process.env.KEY_NEXI && { nexichain }),
    ...(process.env.KEY_PLINGA && { plgchain }),
  },
  etherscan: {
    apiKey: {
      plgchain: 'aaaaaaaaaaaaaaaaaaaa',
    },
    customChains: [
      {
        network: "plgchain",
        chainId: 242,
        urls: {
          apiURL: "http://185.173.129.84:4000/api",
          browserURL: "http://185.173.129.84:4000",
        },
      },
      {
        network: "nexichain",
        chainId: 4242,
        urls: {
          apiURL: "http://185.173.129.242:4000/api",
          browserURL: "http://185.173.129.242:4000",
        },
      },
    ]
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
    overrides: {
      'contracts/libs/Multicall.sol': MONE_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/libs/Multicall3.sol': MTHREE_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/MasterChefV2.sol': FN_OPTIMIZER_COMPILER_SETTINGS,
      'contracts/SousChef.sol': NORMAL_OPTIMIZER_COMPILER_SETTINGS,
    },
  },
  watcher: {
    test: {
      tasks: [{ command: 'test', params: { testFiles: ['{path}'] } }],
      files: ['./test/**/*'],
      verbose: true,
    },
  },
  docgen: {
    pages: 'files',
  },
}
