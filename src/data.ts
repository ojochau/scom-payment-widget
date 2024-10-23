const Tokens_BSC_Testnet = [
    {
        "name": "USDT",
        "address": "0x29386B60e0A9A1a30e1488ADA47256577ca2C385",
        "symbol": "USDT",
        "decimals": 6,
    }
]

const Tokens_Fuji = [
    {
        "name": "Tether USD",
        "address": "0xb9C31Ea1D475c25E58a1bE1a46221db55E5A7C6e",
        "symbol": "USDT.e",
        "decimals": 6
    }
]

export default {
    "infuraId": "adc596bf88b648e2a8902bc9093930c5",
    "defaultData": {
        "defaultChainId": 97,
        "networks": [
            {
                "chainId": 97
            },
            {
                "chainId": 43113
            }
        ],
        "tokens": [
            ...Tokens_BSC_Testnet.map(v => { return { ...v, chainId: 97 }}),
            ...Tokens_Fuji.map(v => { return { ...v, chainId: 43113 }})
        ],
        "wallets": [
            {
                "name": "metamask"
            }
        ]
    }
}