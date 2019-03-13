import * as adRankAPI from '../api/adRankAPI'

chrome.runtime.onMessage.addListener((msg, sender, cb) => {
  if (sender.tab != undefined && sender.tab.id != undefined){
    if (msg.type == 'campaignIsActive') {
      adRankAPI.isCampaign(sender.url).then((res) => {
        chrome.tabs.sendMessage(sender.tab.id, res )
      })
    }
  }
})

