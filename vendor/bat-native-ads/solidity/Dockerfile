FROM mhart/alpine-node:10

RUN mkdir -p /root/app
WORKDIR /root/app

RUN apk update && apk add --no-cache git python g++ make

RUN npm i -g --unsafe-perm ganache-cli truffle 
RUN git clone https://github.com/oraclize/ethereum-bridge.git && cd ethereum-bridge && npm i

RUN yes | truffle init

RUN git clone https://github.com/oraclize/ethereum-api ./oraclize && cp ./oraclize/oraclizeAPI_0.4.sol ./contracts/oraclizeAPI_0.4.sol && rm -rf ./oraclize
RUN git clone https://github.com/bancorprotocol/contracts ./bancor && cp -r ./bancor/solidity/contracts/* ./contracts && rm -rf ./bancor

COPY ./AdsRegistry.sol ./contracts/AdsRegistry.sol
COPY ./2_deploy_contracts.js ./migrations/2_deploy_contracts.js
COPY ./truffle-config.js ./truffle-config.js
COPY ./startup.sh ./startup.sh

RUN truffle compile
RUN chmod +x startup.sh

ENV DOCKER true
EXPOSE 8545
ENTRYPOINT [ "/root/app/startup.sh" ]