// See https://github.com/19379/node-spotify-listenbrainz for setup instructions

const http = require('http');
const https = require('https');
const qs = require('qs');
const crypto = require('crypto');
const token = require('./token.json');

const options = {
	host : 'api.listenbrainz.org',
	path : '/1/submit-listens',
	method: 'POST',
	headers: {
		'Authorization': 'Token ' + token.token
	}
};

console.log('Listening...');

http.createServer((request, response) => {
	let body = '';
	request.setEncoding('utf8');
	
	request.on('error', (err) => {
		console.error(err);
	}).on('data', (chunk) => {
		body += chunk;
	}).on('end', () => {
		let q = qs.parse(request.url.split("?")[1]);
		if (q.hs) { // client wants a handshake
			let end = [
				'OK',
				crypto.createHash('md5').update(String(new Date().getTime())).digest('hex'),
				'http://post.audioscrobbler.com:80/np_1.2',
				'http://post2.audioscrobbler.com:80/protocol_1.2'
			].join('\n');
			//console.log(end);
			response.end(end);
		} else if (request.url == '/np_1.2') { // now playing notification
			response.end('OK\n');
		} else if (request.url == '/protocol_1.2') { // an actual scrobble
			let o = qs.parse(body);
			if (o.i) { // check we have a timestamp
				let payload = [];
				for (let i = 0; i < o.i.length; i++) {
					payload[i] = {
						listened_at : o.i[i],
						track_metadata : {
							artist_name : o.a[i],
							track_name : o.t[i],
							release_name : o.b[i]
						}
					};
				}
				
				let data = {
					listen_type : 'import',
					payload : payload
				};
				
				console.log('Submitting:\n' + JSON.stringify(data, null, 4));
				
				let req = https.request(options, (res) => {
					console.log('Listenbrainz server status: ' + res.statusCode);
				})
				
				req.write(JSON.stringify(data));
				req.end();
			}
			response.end('OK\n');
		}
	});
}).listen(80);
