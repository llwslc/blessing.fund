const env = process.env.NODE_ENV;

const Config = {
  signMsg: 'BLESSING',
  chatServer: { host: '/', path: '/api/socket.io' },
  bigAmount: 500,
  maxHistory: 30,
  chain: {
    privateKey: '01',
    fullHost: 'https://api.trongrid.io',
    eventHost: 'https://api.trongrid.io'
  },
  contract: {
    USDT: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  }
};

const devConfig = {};
if (env === 'development') {
  devConfig.env = env;
  devConfig.chatServer = { host: 'http://localhost:18082', path: '/socket.io' };
  devConfig.bigAmount = 20;
  devConfig.maxHistory = 5;
  devConfig.chain = {
    privateKey: '01',
    fullHost: 'https://testhttpapi.tronex.io',
    eventHost: 'https://testapi.tronex.io'
  };
  devConfig.contract = {
    USDT: ''
  };
}

export default Object.assign(Config, devConfig);
