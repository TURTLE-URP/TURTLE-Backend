const host = 'localhost';
const port = process.env.PORT || 3000;
const options = { hostname: host, port: port, path: '/health', timeout: 5000 };

require('http').get(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
}).on('error', () => process.exit(1));
