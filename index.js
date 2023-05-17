import fetch from 'node-fetch';
import cheerio from 'cheerio'
let url = "https://www.tiktok.com/@okx/video/7223113390380698886"

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('<marquee>Running...</marquee>')
})

app.post('/data', async (req, res) => {
  const { body } = req;
  let url = body.url
  console.log(body);
  console.log(url)
  let data = fetch(url)
  .then(response => {
    if (response.ok) {
      return response.text();
    }
    console.log(response)
    res.send({desc: "Video not found"})
    throw new Error('Network response was not okay.');
  })
  .then(async (text) => {
    let videoData = {}
    const $ = cheerio.load(text)
    const dataScript = $('#SIGI_STATE').text();
    const jsonData = JSON.parse(dataScript);
    const ItemModule = jsonData.ItemModule
    const keys = Object.keys(ItemModule);
    let key = keys[0];
    const dataObject = ItemModule[`${key}`]
    videoData.author = (dataObject.author).trim();
    videoData.desc = dataObject.desc
    videoData = {...videoData, ...dataObject.stats}
    console.log(videoData)
    return videoData

  })
  .catch(error => {
    console.error('Error:', error);
  });

  res.send(await data);
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
