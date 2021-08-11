import './App.css';

import React from 'react';
import Web3 from "web3";
// const Web3 = require('web3');
const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

// TODO: put this meta crap somewhere else
const bsc_contract =
    [
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "spender",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "getOwner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
function create_token_mapping(token_address, token_decimals) {
  return {
    'address': token_address,
    'decimals': token_decimals
  }
}

const available_tokens = new Map();
available_tokens.set('CAKE', create_token_mapping('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', 18));
available_tokens.set('SAFEMOON', create_token_mapping('0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3', 9));
available_tokens.set('BABYDOGE', create_token_mapping('0xc748673057861a797275CD8A068AbB95A902e8de', 9));
available_tokens.set('CORGI', create_token_mapping('0x802c68730212295149f2bea78c25e2cf5a05b8a0', 8));
available_tokens.set('BABYCAKE', create_token_mapping('0xdb8d30b74bf098af214e862c90e647bbb1fcc58c', 18));
available_tokens.set('CYBRRRDOGE', create_token_mapping('0xecc62bd353EDd64Ed31595DbC4C92801aF1e2af0', 9));
available_tokens.set('PORNROCKET', create_token_mapping('0xCF9f991b14620f5ad144Eec11f9bc7Bf08987622', 9));
available_tokens.set('SAFEARN', create_token_mapping('0x099f551eA3cb85707cAc6ac507cBc36C96eC64Ff', 9));
available_tokens.set('HODL', create_token_mapping('0x5788105375ecf7f675c29e822fd85fcd84d4cd86', 9));

function add_new_token(name, address, decimals) {
  available_tokens.set(name, create_token_mapping(address, decimals))
}

function CryptoCard(props) {
  const name = props.name;
  const token_amount = props.token_amount;
  const fiat_amount = props.usd_amount;
  return (
      <div className="col">
        <div className="card text-white bg-dark border-light mb-3">
          <div className="card-header border-light">{name}</div>
          <div className="card-body border-light">
            <p>{token_amount}</p>
            <p>${fiat_amount}</p>
          </div>
        </div>
      </div>
  )
}

class TokenPrices extends React.Component {
  constructor(props) {
    super(props);
    this.get_prices = this.get_prices.bind(this);
    this.walletAddress = props.walletAddress;
    this.state = {
      totalBalance: 0,
      tokenBalance: [],
      disableButton: true
    }
  }

  componentDidMount() {
    this.get_prices();
  }

  async get_prices() {
    this.setState({disableButton: true})
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    let total = 0;
    const tokenPriceBalance = [];
    for (let token of available_tokens) {
      let token_contract = new web3.eth.Contract(bsc_contract, token[1]['address']);
      let tokenBalance = await token_contract.methods.balanceOf(this.walletAddress).call();
      let total_count = tokenBalance.length;
      let balance_integrals = tokenBalance.substr(0,total_count - token[1]['decimals']);
      let balance_decimals = tokenBalance.substr(total_count - token[1]['decimals']);
      let formatted_balance = balance_integrals.concat(".", balance_decimals)
      // TODO: Bulk call...
      let price = await CoinGeckoClient.simple.fetchTokenPrice({
        contract_addresses: token[1]['address'],
        vs_currencies: 'usd',
      }, 'binance-smart-chain');
      let token_price = price['data'][token[1]['address'].toLowerCase()]['usd'];
      let token_balance = token_price * formatted_balance
      tokenPriceBalance.push(<CryptoCard key={token[0]} name={token[0]} token_amount={formatted_balance} usd_amount={token_balance} />)
      total += token_balance;
    }
    this.setState({
      totalBalance: total,
      tokenBalance: tokenPriceBalance,
      disableButton: false
    });
  }

  render() {
    const total = this.state.totalBalance;
    const tokenBalance = this.state.tokenBalance;
    const disableButton = this.state.disableButton;
    // Add some animation to the loading text
    let button;
    if (disableButton) {
      button = <p className="lead text-muted">Loading prices...</p>
    }
    else {
      button = <button className="btn btn-lg btn-outline-light" onClick={this.get_prices}>Get latest prices</button>
    }
    return (
        <div className="px-3">
          <div className="py-5 text-center container">
            <h1>Total Wallet Value: ${total}</h1>
            {button}
          </div>
          <div className="container">
            <div className="row">{tokenBalance}</div>
          </div>
        </div>
    )
  }
}


class MetaMaskControl extends React.Component {
  constructor(props) {
    super(props);
    this.isMetaMaskInstalled = this.isMetaMaskInstalled.bind(this);
    this.connectMetaMask = this.connectMetaMask.bind(this);
    this.getWalletAddress = this.getWalletAddress.bind(this);

    this.state = {
      isInstalled: this.isMetaMaskInstalled(),
      isConnected: false,
      walletAddress: ''
    };
  }

  componentDidMount() {
    this.getWalletAddress().then(result => this.setState({
      walletAddress: result
    }))
  }

// TODO: put ethereum up a level and rename
  isMetaMaskInstalled() {
    const {ethereum} = window;
    return ethereum.isMetaMask;
  }

  async connectMetaMask() {
    try {
      const {ethereum} = window;
      await ethereum.request({method: 'eth_requestAccounts'});
    } catch (error) {
      console.error(error);
    }
    this.setState({isConnected: true});
  }

  async getWalletAddress() {
    const {ethereum} = window;
    const accounts = await ethereum.request({method: 'eth_accounts'});
    return accounts[0];
  }

  render() {
    const isInstalled = this.state.isInstalled;
    const isConnected = this.state.isConnected;
    const walletAddress = this.state.walletAddress
    let metamask;
    if (isInstalled) {
      if (isConnected) {
        metamask =
            <div>
              <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                  <a className="navbar-brand" href="#">MetaMask Token Pricer</a>
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <a className="nav-link active" aria-current="page" href="#">Connected to wallet {walletAddress}</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" href="https://github.com/0100101001010000/metamask-prices">Source Code</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <TokenPrices walletAddress={walletAddress} />
            </div>
      } else {
        metamask =
            <div>
              <button className="btn btn-lg btn-secondary fw-bold border-white bg-white text-dark" onClick={this.connectMetaMask}>
                Connect your MetaMask Wallet
              </button>
            </div>
      }
    } else {
      metamask = <a href="https://metamask.io/download.html">Please install MetaMask</a>
    }

    return (
        <div>
          {metamask}
        </div>
    )
  }
}

function App() {
  return (
    <div className="App">
      <MetaMaskControl/>
    </div>
  );
}

export default App;
