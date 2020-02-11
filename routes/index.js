const express = require('express');
const router = express.Router();

const db = require('../modules/db');
const magnet = require('./magnet');

const foundTemplate = (magnet, meta) => (`
<!DOCTYPE HTML>

<html>
<head>
	<meta charset="UTF-8">
	<title>⚡ ${meta.title}</title>
	<meta http-equiv="refresh" content="0; url=${magnet}">
	<link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
	<h1>${meta.title} </h1>
	<pre>${magnet}</pre>
	</p>
</body>
</html>
`)

const notFoundTemplate = () => (`
<!DOCTYPE HTML>

<html>
<head>
	<meta charset="UTF-8">
	<title>Not Found</title>
	<link rel="stylesheet" href="/stylesheets/style.css">
</head>
<body>
	<h1 style="text-align: center;">⚡ Oops! Nothing found here.</h1>
</body>
</html>
`)

router.get('/:shortlink', (req, res) => {
	db.get(req.params.shortlink)
		.then(record => {
			const r = String(record);
			const [magnet, title] = r.split('@@title@@');
			const meta = {
				title: title ? '⚡ ' + title : '⚡ :magnet:'
			}
			res.send(foundTemplate(magnet, meta))
		})
		.catch(e => {
			console.log(`[ERR!] Occured while retrieving shortlink`, e.stack);
			res.send(notFoundTemplate())
		});
});

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', { title: ':magnet: ⚡️' });
});

router.use('/api', magnet);

module.exports = router;
