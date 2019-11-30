const express = require('express');
const router = express.Router();

const db = require('../modules/db');

const handleSuccess = ({ res, baseUrl, key }) => res.json({ status: 'OK', uri: baseUrl + '/' + key })

const handleError = ({ res, uri }, err) => {
	switch (err.message) {
		case "ERR_NO_URI": {
			console.log(`[ERR!] Invalid request ${uri}`);
			return res.status(400).json({
				err: 'No magnet URI found'
			});
		}
		case "ERR_INVALID_URI": {
			console.log(`[ERR!] Invalid request ${uri}`);
			return res.status(400).json({
				err: 'Invalid magnet URI'
			});
		}
		default: {
			console.log(`[ERR!] Occured while creating new shortlink`, e.stack);
			return res.status(520).json({
				err: 'Unknown err! Please try again'
			});
		}
	}
}

const createMagnet = (uri, title, baseUrl, res) => {
	if (!uri)
		return Promise.reject(new Error("ERR_NO_URI"));

	if (!uri.match(/magnet:\?xt=urn:.*/i))
		return Promise.reject(new Error("ERR_INVALID_URI"));

	const key = Math.random().toString(36).slice(4);
	const value = title ? uri + '@@title@@' + title : uri;
	return db.put(key, value)
		.then(() => handleSuccess({ res, baseUrl, key }))
		.catch(handleError.bind(undefined, { res, uri }));
}

router.get('/:body', (req, res) => {
	const body = req.originalUrl.split('/api/')[1];
	const [uri, title] = body.split('@@title@@');
	const baseUrl = req.protocol + '://' + req.get('host');

	return createMagnet(uri, title, baseUrl, res);
});

/* POST magnet link. */
router.post('/', (req, res) => {
	const { uri, title } = req.body;
	const baseUrl = req.protocol + '://' + req.get('host');

	return createMagnet(uri, title, baseUrl, res);
});

module.exports = router;