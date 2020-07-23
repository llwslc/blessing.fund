const _TronWeb = require('tronweb');
const { deployedPath, deploy, readJson, writeJson } = require('./util');
const config = require('./config');
const contract = config.contract;

const deployedInfo = readJson(deployedPath);
console.log('deployedInfo: ', deployedInfo);
