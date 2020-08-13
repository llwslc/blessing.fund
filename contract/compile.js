const https = require('https');
const path = require('path');
const fs = require('fs');
const wrapper = require('solc/wrapper');
const config = require('./config');

const downloadFile = (uri, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);

    https.get(uri, res => {
      console.log('start download file');
    });
  });
};
