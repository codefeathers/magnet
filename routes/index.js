const express = require('express');
const router = express.Router();

const db = require('../modules/db');
const magnet = require('./magnet');

template = (magnet, meta) => (`
<!DOCTYPE HTML>

<html>
<head>
	<meta charset="UTF-8">
	<title>${meta.title}</title>
	<meta http-equiv="refresh" content="0; url=${magnet}">
	<link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
	<h1>⚡ :magnet:</h1>
	<pre>${magnet}</pre>
	</p>
</body>
</html>
`)

router.get('/:shortlink', (req, res, next) => {
	db.get(req.params.shortlink)
		.then(record => {
			const r = String(record);
			const [ magnet, title ] = r.split('@@title@@');
			const meta = {
				title: title ? '⚡ ' + title : '⚡ :magnet:'
			}
			res.send(template(magnet, meta))
		})
		.catch(e => {
			console.log(`[ERR!] Occured while retrieving shortlink`, e.stack);
			res.end('Invalid shortlink')
		});
})

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: ':magnet: ⚡️' });
});

router.use('/api', magnet);

module.exports = router;
