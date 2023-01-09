//Secure Node EC2 Webhook Server for Github CI/CD

//Be sure to npm install these libraries
const http = require('http');
const exec = require('child_process').exec;
const fs = require('fs');

//Grabbing the security key and port and IP address
const config = JSON.parse(fs.readFileSync('PATH TO YOUR SECRETS'));
const secretKey = config.secretKey;
const port = config.port;
const IP = config.IPA;

http.createServer((req, res) => {
    if (req.method === 'POST') {
    let body = '';
    req.on('data', data => {
      body += data.toString();
    });

    req.on('end', () => {
      if (verifySignature(req, body))
      {
        pullGitRepo();
      }
      else {console.log("Signatures don't match!")};
    });
  }
  res.statusCode = 200;
  res.end('Success!');
}).listen(port, IP);

function pullGitRepo() {
  //Create a shell file and execute some command line to pull your latest github changes
  exec('PATH TO YOUR SHELL FILE', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
}

function verifySignature(req, payloadBody) {
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', secretKey);
  const signature = 'sha256=' + hmac.update(payloadBody).digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(req.headers['x-hub-signature-256']))) {
    return false;
  }
  else {
    console.log("Signature match!");
    return true;
  }
}
