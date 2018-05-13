const express = require('express');
const router = express.Router();

const db = require('../modules/db');

const createMagnet = (uri, title, baseUrl, ctx) => {
	const key = Math.random().toString(36).slice(4);
	if (!uri.match(/magnet:\?xt=urn:.*/i)) {
		console.log(`[ERR!] Invalid request ${uri}`);
		ctx.res.status(400);
		ctx.res.json({
			err: 'Invalid magnet URI'
		});
		return;
	}

	const value = title ? uri + '@@title@@' + title : uri;

	db.put(key, value)
		.then(() => ctx.res.json({
			status: 'OK',
			uri: baseUrl + '/' + key
		}))
		.catch(e => {
			console.log(`[ERR!] Occured while creating new shortlink`, e.stack);
			ctx.res.status(520);
			ctx.res.json({
				err: 'Unknown err! Please try again'
			});
		})
}

router.get('/:body', (req, res, next) => {
	const body = req.originalUrl.split('/api/')[1];
	const [ uri, title ] = body.split('@@title@@');
	const baseUrl = req.protocol + '://' + req.get('host');

	return createMagnet(uri, title, baseUrl, { req, res });
})

/* POST magnet link. */
router.post('/', (req, res, next) => {
	const { uri, title } = req.body;
	const baseUrl = req.protocol + '://' + req.get('host');

	return createMagnet(uri, title, baseUrl, { req, res });
});

module.exports = router;