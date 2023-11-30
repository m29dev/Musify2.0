const account_get = async (req, res) => {
    try {
        const { access_token } = req.params

        const url = 'https://api.spotify.com/v1/me'
        const headers = {
            Authorization: 'Bearer ' + access_token,
        }

        const data = await fetch(url, { headers })
        const dataResponse = await data.json()

        if (dataResponse.error)
            return res
                .status(dataResponse.error.status)
                .json(dataResponse.error.message)

        res.status(200).json(dataResponse)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    account_get,
}
