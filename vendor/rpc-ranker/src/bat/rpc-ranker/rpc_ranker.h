#include <jsonrpccpp/client/connectors/httpclient.h>
#include "bat/rpc-ranker/rpc_stubclient.h"

namespace rpc_ranker {

  class RpcRanker {
    public:
      RpcRanker(const std::string& endpoint);
      ~RpcRanker();

      std::map<std::string, double> GetPriceUpdates ();

    private:
      jsonrpc::HttpClient http_client;
      StubClient rpc_client;
      std::string filter_id;

  };

}
