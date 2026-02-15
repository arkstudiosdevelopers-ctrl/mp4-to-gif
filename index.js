const { exec } = require("child_process");
const fs = require("fs");
const functions = require("@google-cloud/functions-framework");

functions.http("helloHttp", async (req, res) => {
  try {
    if (!req.body || !req.body.videoUrl) {
      return res.status(400).json({ error: "Missing videoUrl" });
    }

    const inputPath = "/tmp/input.mp4";
    const outputPath = "/tmp/output.gif";

    const response = await fetch(req.body.videoUrl);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(inputPath, Buffer.from(buffer));

    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -i ${inputPath} -vf "fps=15,scale=480:-1:flags=lanczos" ${outputPath}`,
        (error) => (error ? reject(error) : resolve())
      );
    });

    const gifBuffer = fs.readFileSync(outputPath);
    res.set("Content-Type", "image/gif");
    res.status(200).send(gifBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
