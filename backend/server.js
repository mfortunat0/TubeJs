const express = require("express");
const { exec } = require("child_process");
const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const cors = require("cors");
const fs = require("fs");

const app = express();

if (fs.existsSync(`${__dirname}/mp3_files`)) {
  exec(`rm -r ${__dirname}/mp3_files`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
    }
    fs.mkdirSync(`${__dirname}/mp3_files`);
  });
}

app.use(express.json());
app.use(cors());
app.use("/static", express.static(__dirname + "/mp3_files"));

app.get("/:url", (req, res) => {
  let YD = new YoutubeMp3Downloader({
    ffmpegPath: "/usr/bin/ffmpeg",
    outputPath: `${__dirname}/mp3_files`,
    youtubeVideoQuality: "highest",
    queueParallelism: 2,
    progressTimeout: 2000,
  });

  YD.download(req.params.url);

  YD.on("finished", function (err, data) {
    res.json({ name: `${data.videoTitle}.mp3` });
  });

  YD.on("error", function (error) {
    console.log(error, "error");
    res.json({ message: error + " Erro" });
  });
});

module.exports = app;
