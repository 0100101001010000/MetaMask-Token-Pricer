import './App.css';

import React from 'react';
import Web3 from "web3";

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

// TODO: put this meta crap somewhere else
const bscContract =
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

function createTokenMapping(tokenAddress, tokenDecimals) {
  return {
    'address': tokenAddress,
    'decimals': tokenDecimals
  }
}

const availableTokens = new Map();
availableTokens.set('BNB', createTokenMapping('binancecoin', 18));
availableTokens.set('CAKE', createTokenMapping('0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', 18));
availableTokens.set('SAFEMOON', createTokenMapping('0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3', 9));
availableTokens.set('BABYDOGE', createTokenMapping('0xc748673057861a797275CD8A068AbB95A902e8de', 9));
availableTokens.set('CORGI', createTokenMapping('0x802c68730212295149f2bea78c25e2cf5a05b8a0', 8));
availableTokens.set('BABYCAKE', createTokenMapping('0xdb8d30b74bf098af214e862c90e647bbb1fcc58c', 18));
availableTokens.set('CYBRRRDOGE', createTokenMapping('0xecc62bd353EDd64Ed31595DbC4C92801aF1e2af0', 9));
availableTokens.set('PORNROCKET', createTokenMapping('0xCF9f991b14620f5ad144Eec11f9bc7Bf08987622', 9));
availableTokens.set('SAFEARN', createTokenMapping('0x099f551eA3cb85707cAc6ac507cBc36C96eC64Ff', 9));
availableTokens.set('HODL', createTokenMapping('0x5788105375ecf7f675c29e822fd85fcd84d4cd86', 9));

class NewTokenModal extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = props.onSubmit;
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleDecimalsChange = this.handleDecimalsChange.bind(this);
    this.addNewToken = this.addNewToken.bind(this);
    this.state = {
      tokenName: '',
      tokenAddress: '',
      tokenDecimals: 0,
      hideModal: "true"
    }
  }

  handleNameChange(e) {
    this.setState({tokenName: e.target.value})
  }

  handleAddressChange(e) {
    this.setState({tokenAddress: e.target.value})
  }

  handleDecimalsChange(e) {
    this.setState({tokenDecimals: e.target.value})
  }

  addNewToken(e) {
    const tokenName = this.state.tokenName;
    const tokenAddress = this.state.tokenAddress;
    const tokenDecimals = parseInt(this.state.tokenDecimals);

    if (!Number.isInteger(tokenDecimals) || tokenName === '' || tokenAddress === '') {
      alert('Fill in the form somewhat correctly');
      console.error('Fields missing or decimals not an int...');
    }
    else {
      availableTokens.set(tokenName, createTokenMapping(tokenAddress, tokenDecimals));
      this.onSubmit()
    }
  }

  render() {
    return (
        <div className="modal fade" id="newTokenModal" tabIndex="-1" aria-labelledby="newTokenModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark border-light">
              <div className="modal-header">
                <h5 className="modal-title" id="newTokenModalLabel">Add New Token</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p>I'm not checking what you're entering, if you enter nonsense you'll break the page for yourself</p>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Token Name</label>
                    <input type="text" className="form-control" onChange={this.handleNameChange} aria-describedby="nameHelp"/>
                    <div id="nameHelp" className="form-text">The name of the token.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Token Address</label>
                    <input type="text" className="form-control" onChange={this.handleAddressChange} aria-describedby="addressHelp"/>
                    <div id="addressHelp" className="form-text">The contract address of the token.</div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Number of Decimals</label>
                    <input type="text" className="form-control" onChange={this.handleDecimalsChange} aria-describedby="decimalsHelp"/>
                    <div id="decimalsHelp" className="form-text">The number of decimals for the token.</div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-outline-light" onClick={this.addNewToken} data-bs-dismiss="modal">Save New Token</button>
              </div>
            </div>
          </div>
        </div>
    )
  }
}


function CryptoCard(props) {
  const name = props.name;
  const tokenAmount = props.tokenAmount;
  const fiatAmount = props.usdAmount;
  return (
      <div className="col">
        <div className="card text-white bg-dark border-light mb-3">
          <div className="card-header border-light">{name}</div>
          <div className="card-body border-light">
            <p>{tokenAmount}</p>
            <p>${fiatAmount}</p>
          </div>
        </div>
      </div>
  )
}

class TokenPrices extends React.Component {
  constructor(props) {
    super(props);
    this.testsubmit= this.testsubmit.bind(this);
    this.getPrices = this.getPrices.bind(this);
    this.walletAddress = props.walletAddress;
    this.state = {
      totalBalance: 0,
      tokenBalance: [],
      disableButton: true,
    }
  }

  componentDidMount() {
    this.getPrices();
  }

  async getPrices() {
    this.setState({disableButton: true})
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

    let total = 0;
    const tokenPriceBalance = [];

    let coinPrice = await CoinGeckoClient.simple.price({
      ids: 'binancecoin',
      vs_currencies: 'usd',
    });

    // TODO: Must be a better way to do this than looping twice...
    let tokenAddresses = [];
    for (let token of availableTokens) {
      tokenAddresses.push(token[1]['address'])
    }

    let tokenPrices = await CoinGeckoClient.simple.fetchTokenPrice({
      contract_addresses: tokenAddresses,
      vs_currencies: 'usd',
    }, 'binance-smart-chain');

    for (let token of availableTokens) {
      let decimalCount = token[1]['decimals'];
      let tokenAddress = token[1]['address'].toLowerCase();
      let tokenBalance;
      let tokenPrice;
      if (token[0] === 'BNB') {
        tokenBalance = await web3.eth.getBalance(this.walletAddress);
        tokenPrice = coinPrice['data'][tokenAddress]['usd'];
      }
      else {
        let token_contract = new web3.eth.Contract(bscContract, tokenAddress);
        tokenBalance = await token_contract.methods.balanceOf(this.walletAddress).call();
        tokenPrice = tokenPrices['data'][tokenAddress]['usd'];
      }
      let totalCount = tokenBalance.length;

      if (totalCount < decimalCount) {
        tokenBalance = tokenBalance.padStart(decimalCount + 1, '0');
        totalCount = tokenBalance.length;
      }

      let balanceIntegrals = tokenBalance.substr(0, totalCount - decimalCount);
      let balanceDecimals = tokenBalance.substr(totalCount - decimalCount);
      let formattedBalance = balanceIntegrals.concat(".", balanceDecimals)

      let fiatBalance = (tokenPrice * formattedBalance);

      tokenPriceBalance.push(<CryptoCard key={token[0]} name={token[0]} tokenAmount={formattedBalance}
                                         usdAmount={fiatBalance.toFixed(2)}/>)

      total += fiatBalance;
    }

    this.setState({
      totalBalance: total,
      tokenBalance: tokenPriceBalance,
      disableButton: false
    });
  }

  testsubmit(e) {
    console.log('submitted...')
  }

  render() {
    const total = this.state.totalBalance;
    const tokenBalance = this.state.tokenBalance;
    const disableButton = this.state.disableButton;
    let button;
    if (disableButton) {
      button =
          <button className="btn btn-lg btn-outline-light" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading prices...
          </button>
    }
    else {
      button = <button className="btn btn-lg btn-outline-light" onClick={this.getPrices}>Get latest prices</button>
    }
    return (
        <div className="px-3">
          <div className="py-5 text-center container">
            <h1>Total Wallet Value: ${total.toFixed(2)}</h1>
            {button}
            <button className="btn btn-lg btn-outline-light" data-bs-toggle="modal" data-bs-target="#newTokenModal">Add token</button>
            <NewTokenModal onSubmit={this.getPrices}/>
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
    this.state = {
      isInstalled: this.isMetaMaskInstalled(),
      isMetaMaskConnected: false,
      walletAddress: ''
    };
  }

// TODO: put ethereum up a level and rename
  isMetaMaskInstalled() {
    const {ethereum} = window;
    return ethereum.isMetaMask;
  }

  async connectMetaMask() {
    let address;
    try {
      const {ethereum} = window;
      const eth_accounts = await ethereum.request({method: 'eth_requestAccounts'});
      console.log(eth_accounts);
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      address = accounts[0];
    } catch (error) {
      console.error(error);
    }
    this.setState({
        isMetaMaskConnected: true,
        walletAddress: address
    });
  }

  render() {
    const isInstalled = this.state.isInstalled;
    const isConnected = this.state.isMetaMaskConnected;
    const walletAddress = this.state.walletAddress;
    const greeting = isConnected ? 'Connected to wallet: '+walletAddress : 'Please conntect your wallet'
    let metamask;
    if (isInstalled) {
      if (isConnected) {
        metamask =
            <div>
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
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <span className="navbar-brand mb-0 h1">MetaMask Token Pricer</span>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <span className="nav-link active" aria-current="page" >{greeting}</span>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
          {metamask}
          <nav className="navbar fixed-bottom navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <a className="navbar-brand" href="https://github.com/0100101001010000/MetaMask-Token-Pricer">Source Code</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavBottom"
                      aria-controls="navbarNavBottom" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavBottom">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <span className="nav-link active" aria-current="page" >Donations welcome: ETH/BNB: 0xd4a715d0b7fd86bE466450C932b1f7C16e726B8D</span>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
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
