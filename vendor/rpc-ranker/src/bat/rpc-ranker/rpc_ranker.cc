#include "bat/rpc-ranker/rpc_ranker.h"
#include "bat/rpc-ranker/rpc_stubclient.h"
#include <jsonrpccpp/client/connectors/httpclient.h>

namespace rpc_ranker {

      RpcRanker::RpcRanker(const std::string& endpoint) : 
        http_client(endpoint),
        rpc_client(http_client, jsonrpc::JSONRPC_CLIENT_V2) {

          std::string strJson = "{\"address\": [\"0x5b1869d9a4c187f2eaa108f3062412ecf0526b24\"]}";   // Keccak of PriceUpdate definition 
          Json::CharReaderBuilder builder;
          Json::CharReader* reader = builder.newCharReader();
          Json::Value filter;

          reader->parse(strJson.c_str(),strJson.c_str() + strJson.size(), &filter, nullptr);

          try {
            filter_id = rpc_client.eth_newFilter(filter);
          } catch (jsonrpc::JsonRpcException &e) {          }     
      }

      RpcRanker::~RpcRanker() {}

      std::map<std::string, double> RpcRanker::GetPriceUpdates () {
        std::map<std::string, double> ret;
        try {
          for(Json::Value &r : rpc_client.eth_getFilterLogs(filter_id)){
            std::string id = r["topics"][1].asString().erase(0,2).erase(32,64);
            int counter = 0;
            std::string sup, conn, wgt = "0x";
            for(char &c: r["data"].asString().erase(0,2)){
              if(counter >= 0 && counter < 64 ){
                sup.push_back(c);
              }
              if(counter >= 64 && counter < 128 ){
                conn.push_back(c);
              }
              if(counter >= 128 && counter < 192 ){
                wgt.push_back(c);
              }
              counter++;
            }

            unsigned long supply = std::stoul(sup, nullptr, 16);
            unsigned long connector = std::stoul(conn, nullptr, 16);
            unsigned long weight = std::stoul(wgt, nullptr, 16);

            double price;
            try{
              price = connector / ( supply * weight);
            }catch(std::logic_error &e){
              price = 0;
            }
            

            ret.insert({id, price});

          }
        } catch (jsonrpc::JsonRpcException &e) {
        } 
        return ret;
      }
};



