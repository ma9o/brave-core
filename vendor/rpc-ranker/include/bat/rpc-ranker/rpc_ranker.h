namespace rpc_ranker {

  class RpcRanker {
    public:
      RpcRanker(const std::string& endpoint);
      ~RpcRanker();

      std::map<std::string, double> GetPriceUpdates ();

  };

}
