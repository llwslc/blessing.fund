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

      if (res.statusCode !== 200) {
        reject(response.statusCode);
        return;
      }

      res.on('data', d => {
        process.stdout.write('.');
      });

      res.on('end', () => {
        console.log('\nfinish download file');
      });

      file
        .on('finish', () => {
          console.log('finish write file');
          file.close(resolve);
        })
        .on('error', err => {
          fs.unlink(dest);
          reject(err.message);
        });

      res.pipe(file);
    });
  });
};

const compile = async () => {
  const solUri = `https://tron-us.github.io/tron-solc-bin/bin/soljson_v${config.version}.js`;
  const solPath = `./soljson_v${config.version}.js`;

};
