const token = ''; 

const http = require('http');
const https = require('https');
const querystring = require('querystring');
const crypto = require('crypto');
const options = {
	host : 'api.listenbrainz.org',
	path : '/1/submit-listens',
	method: 'POST',
	headers: {
		'Authorization': 'Token ' + token
	}
};

http.createServer((request, response) => {
	let body = [];
	request.on('error', (err) => {
		console.error(err);
	}).on('data', (chunk) => {
		body.push(chunk);
	}).on('end', () => {
		body = Buffer.concat(body).toString();
		let qs = querystring.parse(request.url.split("?")[1]);
		if (qs.hs) { // client wants a handshake
			console.log(JSON.stringify(qs, null, 4));
			let end = [
				'OK',
				crypto.createHash('md5').update(String(new Date().getTime())).digest('hex'),
				'http://post.audioscrobbler.com:80/np_1.2',
				'http://post2.audioscrobbler.com:80/protocol_1.2'
			].join('\n');
			//console.log(end);
			response.end(end);
		} else {
			let o = querystring.parse(body);
			if (o['i[0]']) {
				let data = {
					listen_type : 'single',
					payload : [{
						listened_at : o['i[0]'],
						track_metadata : {
							artist_name : o['a[0]'],
							track_name : o['t[0]'],
							release_name : o['b[0]']
						}
					}]
				};
				
				console.log('Submitting:\n' + JSON.stringify(data, null, 4));
				
				let post = https.request(options, (res) => {
					console.log('Status: ' + res.statusCode);
				})
				post.write(JSON.stringify(data));
				post.end();
			}
			response.end('OK\n');
		}
		
	});
}).listen(80);
