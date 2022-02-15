const express = require('express'); // Express web server framework
const router = express.Router()
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; // Your secret
const redirect_uri = "http://localhost:3000/spotify/callback"; // Your redirect uri

// initialise userController methods
// const { getUser } = require('../controllers/user_controller')
//
// const User = require('../models/user_schema')
// const id = User.

// User.findOneAndUpdate(
// 	{ _id: id },
// 	{ "tokens.spotify.access_token" : access_token, "tokens.spotify.refresh_token" : refresh_token }
// )

// const updateToken = (req, res, access_token, refresh_token) => {
// 	getUser(id)
// 	User.findById(req.params.id)
// 		.then((data) =>{
// 			if(data){
// 				res.status(200).json(data)
// 			}
// 			else{
// 				res.status(404).json(`User with id: ${req.params.id} not found!`)
// 			}
// 		})
// 		.catch((err)=>{
// 			console.error(err)
// 			res.status(500).json(err)
// 		})
// }

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
let generateRandomString = function (length) {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
};

const stateKey = 'spotify_auth_state';

router.use(express.static(__dirname + '/public'))
	.use(cors())
	.use(cookieParser());

router.get('/login', function(req, res) {

	let state = generateRandomString(16);
	res.cookie(stateKey, state);

	// your application requests authorization
	let scope =
		// Users //
		'user-read-private ' + // token will allow user to access their private details
		'user-read-email ' + // token will allow user to access their email
		// Library //
		'user-library-read ' + // token will allow user to read their library
		'user-library-modify ' + // token will allow user to modify their library
		// Follow //
		'user-follow-read ' + // token will allow user to read their follows
		'user-follow-modify ' + // token will allow user to modify their follows
		// Listening History //
		'user-top-read ' + // token will allow user to read their top music
		'user-read-recently-played ' + // token will allow user to read their recently played
		// Playlists //
		'playlist-read-private ' + // token will allow user to read their private playlists
		'playlist-modify-private ' + // token will allow user to modify their private playlists
		'playlist-modify-public ' + // token will allow user to modify their public playlists
		'playlist-read-collaborative ' + // token will allow user to read their collaborative playlists
		// Spotify Connect //
		'user-read-playback-state ' + // token will allow user to read their player's state
		'user-modify-playback-state ' + // token will allow user to control their player's state
		'user-read-currently-playing'; // token will allow user to read their currently playing content

	res.redirect('https://accounts.spotify.com/authorize?' +
		querystring.stringify({
			response_type: 'code',
			client_id: client_id,
			scope: scope,
			redirect_uri: redirect_uri,
			state: state
		}));
});

router.get('/callback', function(req, res) {

	// your application requests refresh and access tokens
	// after checking the state parameter

	let code = req.query.code || null;
	let state = req.query.state || null;
	let storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect('/#' +
			querystring.stringify({
				error: 'state_mismatch'
			}));
	} else {
		res.clearCookie(stateKey);
		let authOptions = {
			url: 'https://accounts.spotify.com/api/token',
			form: {
				code: code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
			},
			headers: {
				// Originally Buffer() not Buffer.from() but changed due Buffer() being deprecated
				'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
			},
			json: true
		};

		request.post(authOptions, function(error, response, body) {
			if (!error && response.statusCode === 200) {

				let access_token = body.access_token,
					refresh_token = body.refresh_token;

				let options = {
					url: 'https://api.spotify.com/v1/me',
					headers: { 'Authorization': 'Bearer ' + access_token },
					json: true
				};

				// use the access token to access the Spotify Web API
				request.get(options, function(error, response, body) {
					console.log(body);
				});

				// we can also pass the token to the browser to make requests from there
				res.redirect('http://localhost:8080/spotify?' + // Redirects to playground/spotify (was /#)
					querystring.stringify({
						access_token: access_token,
						refresh_token: refresh_token
					}));
			} else {
				res.redirect('http://localhost:8080/spotify?' + // Redirects to playground/spotify (was /#)
					querystring.stringify({
						error: 'invalid_token'
					}));
			}
		});
	}
});

router.get('/refresh_token', function(req, res) {

	// requesting access token from refresh token
	let refresh_token = req.query.refresh_token;
	let authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: {'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))},
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var access_token = body.access_token;
			res.send({
				'access_token': access_token
			});
		}
	});
});

module.exports = router;