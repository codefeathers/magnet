const express = require('express');
const router = express.Router();

const db = require('../modules/db');

/* POST magnet link. */
router.post('/', function(req, res, next) {
	const key = Math.random().toString(36).slice(4);
	const { uri, title } = req.body;
	const baseUrl = req.protocol + '://' + req.get('host');

	if(!uri.match(/magnet:\?xt=urn:.*/i)) {
		console.log(`[ERR!] Invalid request ${uri}`);
		res.status(400);
		res.json = {
			err: 'Invalid magnet URI'
		}
		return;
	}

	const value = title ? uri + '@@title@@' + title : uri;

	db.put(key, value)
		.then(() => res.json({
			status: 'OK',
			uri: baseUrl + '/' + key
		}))
		.catch(e => {
			console.log(`[ERR!] Occured while creating new shortlink`, e.stack);
			res.status(520);
			res.json = {
				err: 'Unknown err! Please try again'
			}
		})
});

module.exports = router;
