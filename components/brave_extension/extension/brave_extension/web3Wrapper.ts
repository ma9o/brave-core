
const currentScript = document.currentScript

let contract: any
const address = "0x5b1869D9A4C187F2EAa108f3062412ecf0526b24"
const abi: any[] = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "bytes16"
      },
      {
        "name": "_challenge",
        "type": "string"
      }
    ],
    "name": "buy",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function",
    "signature": "0x217b67c0"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_id",
        "type": "bytes16"
      },
      {
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "sell",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function",
    "signature": "0x3c26d958"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "_id",
        "type": "bytes16"
      }
    ],
    "name": "getPrice",
    "outputs": [
      {
        "name": "supply",
        "type": "uint256"
      },
      {
        "name": "connector",
        "type": "uint256"
      },
      {
        "name": "weight",
        "type": "uint32"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function",
    "signature": "0x570ded3d"
  },
]

document.addEventListener('load', () => {
  let c = (window as any).web3.eth.contract(abi)
  try{
    contract = c.at(address)
    document.dispatchEvent(new Event('web3Ready'))
  }catch(e){
    console.error(e)
  }
}, { 
  capture: true,
  once: true
})

window.addEventListener("message", (event: MessageEvent) => {
  if (currentScript instanceof HTMLScriptElement){  
    switch (event.data.type) {
      case 'buy':
        try {
          let challenge = (window as any).grecaptcha.getResponse()
          window.console.log(challenge)
          contract.buy(currentScript.dataset.uuid, challenge, { value: (window as any).web3.toWei(event.data.amount), gas: 2000000 }, buyCB)
        } catch (e) {
          console.error(e)
        }
        break
      case 'sell':
        try{
          contract.sell(currentScript.dataset.uuid, (window as any).web3.toWei(event.data.amount), sellCB)
        }catch(e) {
          console.error(e)
        }
        break
      case 'getPrice':
        try {
          contract.getPrice.call(currentScript.dataset.uuid, getPriceCB)
        } catch (e) {
          console.error(e)
        }
        break
    }
  }
})

const getPriceCB = (error:any, data:any) => {
  let price = data[1].toNumber() / (data[0].toNumber() * data[2].toNumber())
  if(isNaN(price)){
    price = 0
  }
  window.postMessage({ type: 'getPriceCB', result: price, error: error }, '*')
} 

const sellCB = (error: any, data: any) => {
  window.postMessage({ type: 'sellCB', result: data, error: error }, '*')
} 

const buyCB = (error: any, data: any) => {
  window.postMessage({ type: 'buyCB', result: data, error: error }, '*')
} 

