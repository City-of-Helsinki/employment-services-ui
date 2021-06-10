import path from 'path'
import dotEnv from 'dotenv';
dotEnv.config({ path: path.resolve(__dirname + "/../../.env") });
import express from 'express';
import apiRouter from './api/api';
const fs = require("fs")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../../build')));

app.use('/api', apiRouter);

app.get("/*", (req, res) => {
  // const raw = fs.readFileSync(path.resolve(__dirname, '../../build/index.html'), 'utf8')
  // const pageTitle = "Homepage - Welcome to my page"
  // const updated = raw.replace("__PAGE_META__", `<title>${pageTitle}</title>`)
  // console.log(updated)
  // res.send(updated)

  const filePath = path.resolve(__dirname, '../../build/index.html')
  fs.readFile(filePath, 'utf8', function (err: any,data: any) {
    if (err) {
      return console.log(err);
    }
    data = data.replace(/\$OG_TITLE/g, 'About Page');
    data = data.replace(/\$OG_DESCRIPTION/g, "About page description");
    const result = data.replace(/\$OG_IMAGE/g, 'https://i.imgur.com/V7irMl8.png');
    res.send(result);
  });
})


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../build/index.html'));
});

const port = process.env.SERVER_PORT || 9000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
