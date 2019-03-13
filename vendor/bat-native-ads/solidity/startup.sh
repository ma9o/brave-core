#!/bin/sh
ganache-cli -d &
truffle migrate --development
/root/app/ethereum-bridge/ethereum-bridge -H localhost:8545 -a 1 