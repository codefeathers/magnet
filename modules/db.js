const levelup = require('levelup');
const leveldown = require('leveldown');

module.exports = levelup(leveldown(__dirname + '/../store'), (err, db) => {
	if(err) { console.error(err); process.exit(1) };
	return db;
});