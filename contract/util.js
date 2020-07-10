const TronWeb = require('tronweb');
const SunWeb = require('sunweb');
const BigNumber = require('bignumber.js');
const fs = require('fs');
const config = require('./config');
const chain = config.chain;

const env = process.env.NODE_ENV;
const deployedPath = `./contractInfo${env ? '_' + env : ''}.json`;

const privateKey = chain.privateKey;

const mainchain = new TronWeb(chain.mainFullHost, chain.mainFullHost, chain.mainEventHost, privateKey);
const sidechain = new TronWeb(chain.sideFullHost, chain.sideFullHost, chain.sideEventHost, privateKey);
const sunweb = new SunWeb(mainchain, sidechain, chain.mainGateway, chain.sideGateway, chain.chainId);
