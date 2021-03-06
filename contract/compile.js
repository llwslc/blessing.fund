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

  if (!fs.existsSync(solPath)) {
    await downloadFile(solUri, solPath);
  }

  const sourceDirPath = path.resolve(process.cwd(), './solc');
  const bytecodeDirPath = path.resolve(process.cwd(), './bin');

  const files = fs.readdirSync(sourceDirPath);

  if (files.length) {
    if (!fs.existsSync(bytecodeDirPath)) {
      fs.mkdirSync(bytecodeDirPath);
    }
  }

  let input = {
    language: 'Solidity',
    sources: {},
    settings: {
      optimizer: {
        enabled: true
      },
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  for (const f of files) {
    const file = path.resolve(sourceDirPath, f);
    const stat = fs.lstatSync(file);
    if (path.extname(file) != '.sol') continue;
    if (stat.isDirectory()) continue;

    input.sources[f] = {
      content: fs.readFileSync(file, 'utf8')
    };
  }

  for (const f of config.contract) {
    const filename = `${f}.sol`;
    const file = path.resolve(sourceDirPath, filename);

    const solc = wrapper(require(solPath));
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    let errorFlag = false;
    if (output.errors) {
      for (const error of output.errors) {
        if (error.severity == 'error') {
          console.error('error file: ', file);
          console.error('error: ', error.formattedMessage);
          errorFlag = true;
        }
      }
    }

    if (errorFlag) continue;

    if (output.contracts) {
      const targetFilePath = path.resolve(bytecodeDirPath, `${f}.json`);
      for (const contract in output.contracts[filename]) {
        console.log('success: ', file, contract);
        const bytecode = output.contracts[filename][contract].evm.bytecode.object;
        const abi = output.contracts[filename][contract].abi;
        const version = JSON.parse(output.contracts[filename][contract].metadata).compiler.version;
        const obj = { name: f, abi, bytecode, version };
        fs.writeFileSync(targetFilePath, JSON.stringify(obj), 'utf8');
      }
    }
  }
};

compile();
