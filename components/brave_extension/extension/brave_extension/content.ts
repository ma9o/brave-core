import * as ReactDOM from 'react-dom'
import AdRankBanner from "./components/adRankBanner"
import * as React  from 'react'

const unique = require('unique-selector').default

function getCurrentURL () {
  return window.location.hostname
}

document.addEventListener('contextmenu', (event) => {
  let selector = unique(event.target) // this has to be done here, events can't be passed through the messaging API
  let baseURI = getCurrentURL()

  chrome.runtime.sendMessage({
    selector: selector,
    baseURI: baseURI
  })
}, true)

window.addEventListener('web3Ready', (event) => {
  const rankerBanner = document.createElement('div')
  rankerBanner.id = "ad-ranker-banner"
  document.body.insertBefore(rankerBanner, document.body.childNodes[0])

  ReactDOM.render(
    React.createElement(AdRankBanner),
    document.getElementById(rankerBanner.id),
    () => {
      setTimeout(() => {
        const captcha = document.createElement('script')
        captcha.src = 'https://www.google.com/recaptcha/api.js'
        captcha.defer = true
        captcha.async = true
        if (document.head != null)
          document.head.appendChild(captcha)
      }, 1000)
    }
  )

}, {capture:true, once: true})

window.onload = () => {
  chrome.runtime.sendMessage({type: 'campaignIsActive'})
  chrome.runtime.onMessage.addListener((response, sender, cb) => {
    if (response != null && document.head != null) {
      const web3Wrapper = document.createElement('script')
      web3Wrapper.src = chrome.runtime.getURL('js/web3Wrapper.bundle.js');
      web3Wrapper.dataset.uuid = "0x"+response
      document.head.appendChild(web3Wrapper) 
    } else {
      window.console.log('Not part of a Brave ads campaign.')
    }
  })
  
}


