const fs = require('fs');

module.exports = {
	addNode: function (id, ip, callback) {
		fs.appendFile('./HAProxy/haproxy.cfg', `    server ${id} ${ip}:80 check\n`, function () {
			callback(true);
		});
	},
	removeNode: function (id, ip, callback) {
		console.log(`    server ${id} ${ip}:80 check\n`);
		var cfg = fs.readFileSync('./HAProxy/haproxy.cfg').toString();
		cfg = cfg.replace(`    server ${id} ${ip}:80 check\n`, '');
		fs.writeFileSync('./HAProxy/haproxy.cfg', cfg);
		callback(true);
	}
};
