require('dotenv').config()
const baseYoutubeUrl = `https://www.googleapis.com/youtube/v3`

const youtube_get = async (req, res) => {
    try {
        const { query } = req.params

        const yt = await fetch(
            `${baseYoutubeUrl}/search?key=${process.env.YOUTUBE_API_KEY}&type=video&q=${query}`
        )
        const ytData = await yt.json()

        if (!ytData.items)
            return res
                .status(403)
                .json({ message: 'daily limit has been reached' })

        console.log(2, ytData.items[0])
        res.json(ytData.items[0])
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    youtube_get,
}
