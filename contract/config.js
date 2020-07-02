const env = process.env.NODE_ENV;

const Config = {
  version: '0.5.9',
  contract: [],
  chain: {
    privateKey: process.env.PRIVATE_KEY,
    /**
     * Create a .env file (it must be gitignored) containing something like
     * export PRIVATE_KEY=4E7FECCB71207B867C495B51A9758B104B1D4422088A87F4978BE64636656243
     * source .env && npm run deploy
     */
    mainFullHost: 'https://api.trongrid.io',
    mainEventHost: 'https://api.trongrid.io',
    sideFullHost: 'https://sun.tronex.io',
    sideEventHost: 'https://sun.tronex.io',
    mainGateway: 'TWaPZru6PR5VjgT4sJrrZ481Zgp3iJ8Rfo',
    sideGateway: 'TGKotco6YoULzbYisTBuP6DWXDjEgJSpYz',
    chainId: '41E209E4DE650F0150788E8EC5CAFA240A23EB8EB7'
  }
};

const devConfig = {};
if (env === 'development') {
  devConfig.env = env;
  devConfig.chain = {
    privateKey: process.env.PRIVATE_KEY_DEV,
    mainFullHost: 'https://testhttpapi.tronex.io',
    mainEventHost: 'https://testapi.tronex.io',
    sideFullHost: 'https://suntest.tronex.io',
    sideEventHost: 'https://suntest.tronex.io',
    mainGateway: 'TFLtPoEtVJBMcj6kZPrQrwEdM3W3shxsBU',
    sideGateway: 'TRDepx5KoQ8oNbFVZ5sogwUxtdYmATDRgX',
    chainId: '413AF23F37DA0D48234FDD43D89931E98E1144481B'
  };
}

module.exports = Object.assign(Config, devConfig);
