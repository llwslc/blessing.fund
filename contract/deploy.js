const _TronWeb = require('tronweb');
const { deployedPath, deploy, readJson, writeJson } = require('./util');
const config = require('./config');
const contract = config.contract;

const deployedInfo = readJson(deployedPath);
console.log('deployedInfo: ', deployedInfo);
const deployedMoreInfoKey = '_more';
let deployedMoreInfo = {};

const notDeployed = async () => {
  for (const c of contract) {
    if (deployedInfo[c]) continue;
    const obj = readJson(`./bin/${c}.json`);
    const { address, txHash } = await deploy(obj.name, obj.bytecode);
    deployedInfo[c] = address;
    deployedMoreInfo[`${c}_T`] = _TronWeb.address.fromHex(address);
