const https = require("https");
const index = `https://storage.googleapis.com/${process.env.BUCKET_NAME}/index.html`;

exports.index = (_, res) => https.get(index, (response) => {
  response.pipe(res);
}).on("error", () => {
  res.status(404).send();
});
