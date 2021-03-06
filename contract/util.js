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

const deploy = async (name, bytecode, mainchain = false) => {
  try {
    const chain = mainchain ? sunweb.mainchain : sunweb.sidechain;
    const transaction = await chain.transactionBuilder.createSmartContract({
      abi: [],
      bytecode,
      name
    });
    const signedTransaction = await chain.trx.sign(transaction, privateKey);
    const result = await chain.trx.sendRawTransaction(signedTransaction);
    return result && result.result
      ? { address: result.transaction.contract_address, txHash: result.transaction.txID }
      : {};
  } catch (error) {
    console.log(`deploy error ${name}`, error.message ? error.message : error);
    return {};
  }
};

const trigger = async (address, functionSelector, parameters = [], options = {}, mainchain = false) => {
  try {
    const chain = mainchain ? sunweb.mainchain : sunweb.sidechain;
    const transaction = await chain.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      options,
      parameters
    );
    if (!transaction.result || !transaction.result.result) {
      throw new Error('Unknown trigger error: ' + JSON.stringify(transaction.transaction));
    }
    const signedTransaction = await chain.trx.sign(transaction.transaction, privateKey);
    const result = await chain.trx.sendRawTransaction(signedTransaction);
    return result;
  } catch (error) {
    console.log(`trigger error ${address} - ${functionSelector}`, error.message ? error.message : error);
    return {};
  }
};

const view = async (address, functionSelector, parameters = [], mainchain = false) => {
  try {
    const chain = mainchain ? sunweb.mainchain : sunweb.sidechain;
    const result = await chain.transactionBuilder.triggerSmartContract(
      address,
      functionSelector,
      { _isConstant: true },
      parameters
    );
    return result && result.result ? result.constant_result : [];
  } catch (error) {
    console.log(`view error ${address} - ${functionSelector}`, error.message ? error.message : error);
    return [];
  }
};

const readJson = path => {
  try {
    const str = fs.readFileSync(path);
    return JSON.parse(str);
  } catch (error) {
    console.log('readJson: ', error.message ? error.message : error);
    return {};
  }
};

const writeJson = (path, obj) => {
  try {
    const str = JSON.stringify(obj);
    fs.writeFileSync(path, str);
  } catch (error) {
    console.log('writeJson: ', error.message ? error.message : error);
  }
};

const hexStringToAddress = hexStr => {
  return TronWeb.address.fromHex(`41${hexStr}`);
};

const hexStringToNumber = hexStr => {
  return new BigNumber(hexStr, 16).toNumber();
};

module.exports = { deployedPath, deploy, trigger, view, readJson, writeJson, hexStringToAddress, hexStringToNumber };
