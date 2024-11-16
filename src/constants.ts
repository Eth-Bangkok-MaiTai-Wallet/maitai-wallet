export const BASE_SEPOLIA_CHAIN_ID = 84532;
export const ARB_SEPOLIA_CHAIN_ID = 421614;
export const SEPOLIA_CHAIN_ID = 11155111;
export const POLYGON_CHAIN_ID = 137;
export const mintContractAddress = '0xA3e40bBe8E8579Cd2619Ef9C6fEA362b760dac9f';
export const promptContractAddress = '0x696c83111a49eBb94267ecf4DDF6E220D5A80129';
// export const storageContractAddress = '0x66bd1D59F0BA7205289780A5E79fbeE9a607E003'//base
export const storageContractAddress = '0x142F0fa2A1692a5423b9Bf3188f64dCd98987303'//eth
export const mintABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'public',
    type: 'function',
  },
] as const;

export const storageABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "store",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "retrieve",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
] as const;

export const storageTestABI = [{"inputs":[],"name":"retrieve","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"num","type":"uint256"}],"name":"store","outputs":[],"stateMutability":"nonpayable","type":"function"}]

export const promptABI = [{"inputs":[{"internalType":"contract IAIOracle","name":"_aiOracle","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"contract IAIOracle","name":"expected","type":"address"},{"internalType":"contract IAIOracle","name":"found","type":"address"}],"name":"UnauthorizedCallbackSource","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"modelId","type":"uint256"},{"indexed":false,"internalType":"string","name":"prompt","type":"string"}],"name":"promptRequest","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"requestId","type":"uint256"},{"indexed":false,"internalType":"string","name":"output","type":"string"},{"indexed":false,"internalType":"bytes","name":"callbackData","type":"bytes"}],"name":"promptsUpdated","type":"event"},{"inputs":[],"name":"aiOracle","outputs":[{"internalType":"contract IAIOracle","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"bytes","name":"output","type":"bytes"},{"internalType":"bytes","name":"callbackData","type":"bytes"}],"name":"aiOracleCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"modelId","type":"uint256"},{"internalType":"string","name":"prompt","type":"string"}],"name":"calculateAIResult","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"callbackGasLimit","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"modelId","type":"uint256"}],"name":"estimateFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"}],"name":"isFinalized","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"requests","outputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"modelId","type":"uint256"},{"internalType":"bytes","name":"input","type":"bytes"},{"internalType":"bytes","name":"output","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"modelId","type":"uint256"},{"internalType":"uint64","name":"gasLimit","type":"uint64"}],"name":"setCallbackGasLimit","outputs":[],"stateMutability":"nonpayable","type":"function"}]


