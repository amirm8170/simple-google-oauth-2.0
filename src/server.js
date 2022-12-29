const fs = require("fs");
const path = require("path");
const app = require("./app");
const server = require("https").createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "..", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "..", "cert.pem")),
  },
  app
);
const PORT = process.env.PORT || 3000;


server.listen(PORT, () => {
  console.log(`app is listening on ${PORT}`);
});
