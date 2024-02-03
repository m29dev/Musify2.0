require('dotenv').config()
const querystring = require('querystring')
const request = require('request')

// new access
const auth = async (req, res) => {
    try {
        const client_id = process.env.SPOTIFY_CLIENT_ID
        const client_secret = process.env.SPOTIFY_CLIENT_SECRET

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                Authorization:
                    'Basic ' +
                    new Buffer.from(client_id + ':' + client_secret).toString(
                        'base64'
                    ),
            },
            form: {
                grant_type: 'client_credentials',
            },
            json: true,
        }

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var token = body.access_token
                console.log('user has been authorized: ', token)

                res.status(200).json(token)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    auth,
}
