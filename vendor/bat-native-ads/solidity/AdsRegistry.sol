pragma solidity ^0.4.24;

import "./converter/BancorFormula.sol";
import "./oraclizeAPI_0.4.sol";
import "./utility/SafeMath.sol";

contract AdsRegistry is usingOraclize {

    string constant GOOGLE_API_KEY = "6LdKcJIUAAAAAIyjBDR9Awrq-Oz3eAuJ3NQ-cqLd";
    uint32 constant WEIGHT = 500000;
    uint256 constant FEE_PCT = 100000;

    mapping(bytes16 => Campaign) campaigns;
    mapping(bytes32 => Query) queries;
    address owner;
    BancorFormula formula;

    struct Query {
        address issuer;
        uint256 amount; 
        bytes16 id;
    }

    struct Campaign {
        uint256 connector;
        uint256 supply;
        bool active;
        mapping(address => uint256) balances;
    }

    event PriceUpdate(bytes16 indexed _id, uint256 _supply, uint256 _connector, uint32 _weight);

    modifier oraclizeOnly() {
        require(msg.sender == oraclize_cbAddress(), "Must be invoked by Oraclize");
        _;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Must be invoked by owner");
        _;
    }

    constructor() public {
        owner = msg.sender;
        formula = new BancorFormula();
    }

    function getPrice(bytes16 _id) public view returns (uint256 supply, uint256 connector, uint32 weight){
        return (campaigns[_id].supply, campaigns[_id].connector, WEIGHT);
    }

    function __callback(bytes32 _query, string memory _result) public oraclizeOnly {
        Query q = queries[_query];

        if(keccak256(_result) != keccak256("true")){
            address(q.issuer).transfer(q.amount);
            revert("Invalid reCapcha input");
        }

        Campaign storage c = campaigns[q.id];

        uint256 ret = formula.calculatePurchaseReturn(c.supply, c.connector, WEIGHT, q.amount);
        c.balances[q.issuer] += ret;
        c.supply += ret;
        c.connector += q.amount;
        emit PriceUpdate(q.id, c.supply, c.connector, WEIGHT);
    }
    
    function buy(bytes16 _id, string memory _challenge) public payable {
        require(campaigns[_id].active, "Campaign not active");
        require(msg.value > oraclize_getPrice("URL"), "Not enough eth");
        
        bytes32 queryid = oraclize_query(
            "URL", 
            "json(https://www.google.com/recaptcha/api/siteverify).success", 
            strConcat(
                '{"secret":"',
                GOOGLE_API_KEY,
                '","response":"',
                _challenge,
                '"}'
            ),
            1500000
        );
        Query query;
        query.issuer = msg.sender;
        query.amount = msg.value;
        query.id = _id;
        queries[queryid] = query;
    }

    function sell(bytes16 _id, uint256 _amount) public {
        Campaign storage c = campaigns[_id];
        uint256 ret = formula.calculateSaleReturn(c.supply, c.connector, WEIGHT, _amount);
        ret = SafeMath.div(SafeMath.mul(ret, 1000000 - FEE_PCT), 1000000);
        c.balances[msg.sender] -= _amount;
        c.supply -= _amount;
        c.connector -= ret;
        address(msg.sender).transfer(ret);
        emit PriceUpdate(_id, c.supply, c.connector, WEIGHT);
    }

    function addCampaign(bytes16 _id) public payable ownerOnly {
        Campaign c;
        c.active = true;
        c.supply = 1000;
        c.connector = msg.value;
        campaigns[_id] = c;
    }

    function removeCampaign(bytes16 _id) public ownerOnly{
        delete campaigns[_id];
    }
}