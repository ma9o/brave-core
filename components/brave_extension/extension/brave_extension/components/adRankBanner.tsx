import * as React from "react"

const GOOGLE_API_KEY = "6LdKcJIUAAAAACrppOjYzIKPG979Xy6KOk0R_iHe"

interface State {
    challenge : string,
    amount : number,
    loading : boolean,
    price : number,
    closed : boolean,
    error : boolean,
}

const wrapperStyle = { display: 'flex', alignItems: 'center', placeContent: 'center', backgroundColor: 'grey', textShadow: '1px 1px 1px #000000', border: '4px dotted black'}
const labelStyle = {margin: '1em', textDecoration: 'none', color: 'yellow'}
const inputStyle = {width: '5em', color:'black'}
const priceStyle = {color: 'yellow', marginRight: '1em'}
const captchaStyle = { display: 'inline-block', margin: '1em' }
const buttonStyle = { color: 'black' }

export default class AdRankBanner extends React.Component<{}, State> {

    recaptchaRef: React.RefObject<any>

    componentDidMount = () => {
        this.getPrice()
        this.recaptchaRef = React.createRef()
    }

    onAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        let x = parseFloat(event.target.value)
        if(!isNaN(x)){
            this.setState({ amount: x})
        }
    }

    onSell = () => {
        this.setState({ loading: true })
        window.postMessage({type: 'sell', amount: this.state.amount}, '*')
        window.addEventListener('message', this.sellCallback)
    }

    sellCallback = (res: MessageEvent) => {
        if(res.data.type == 'sellCB'){
            res.data.error != null ? this.setState({ error: true }) : this.setState({ closed: true })
            window.removeEventListener('message', this.sellCallback)
        }
    }

    onBuy = () => {
        this.setState({loading: true})
        window.postMessage({ type: 'buy', amount: this.state.amount},'*')
        window.addEventListener('message', this.buyCallback)
    }

    buyCallback = (res:MessageEvent) => {
        if(res.data.type == 'buyCB'){
            res.data.error != null ? this.setState({ error: true }) : this.setState({ closed: true })
            window.removeEventListener('message', this.buyCallback)
        }
    }

    getPrice = () => {
        window.postMessage({ type: 'getPrice'}, '*')
        window.addEventListener('message', this.priceCallback)
    }

    priceCallback = (res: MessageEvent) => {
        if(res.data.type == 'getPriceCB'){
            res.data.error != null ? this.setState({ error: true }) : this.setState({ price: res.data.result.toFixed(4) })
            window.removeEventListener('message', this.priceCallback)
        }
    }

    render() {
        if (this.state != null && !this.state.closed){
            return ( 
                <div style={wrapperStyle}>
                    <a style={labelStyle}>Would you like to endorse this campaign?</a>
                    <input value={this.state.amount | 0} onChange={this.onAmount} style={inputStyle}/>
                    <a style={priceStyle}>@{this.state.price}</a>
                    {this.state.loading ? (<button>LOADING</button>) : (<button onClick={this.onBuy} style={buttonStyle}>BUY</button>)}
                    {this.state.loading ? (<button>LOADING</button>) : (<button onClick={this.onSell} style={buttonStyle}>SELL</button>)}
                    <div style={captchaStyle} className="g-recaptcha" data-sitekey={GOOGLE_API_KEY}></div>
                </div>
            )
        }else{
            return(<div></div>)
        }
    }


        
}