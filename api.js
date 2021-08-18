const express = require("express");
const bodyParser = require("body-parser");
var methodOverride = require("method-override");
const busboy = require("connect-busboy");
const path = require("path");
const fs = require("fs");
const app = express();
app.use(busboy());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/files", express.static("files"));
const PORT = 8001;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/getFiles", (req, res) => {});

app.post("/fileUpload", (req, res) => {
  var fileStream;
  req.pipe(req.busboy);
  req.busboy.on("file", (fieldName, file, filename) => {
    fileStream = fs.createWriteStream(__dirname + "/files/" + filename);
    file.pipe(fileStream);
    fileStream.on("close", () => {
      res.redirect("./files/" + filename);
      res.end(
        JSON.stringify({
          status: 200,
          message: "File uploaded!",
          success: true,
        })
      );
    });
  });
});
