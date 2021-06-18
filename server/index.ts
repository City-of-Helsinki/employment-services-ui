import path from 'path'
import dotEnv from 'dotenv';
dotEnv.config({ path: path.resolve(__dirname + "/../../.env") });
import express from 'express';
import axios from "axios";
import apiRouter from './api/api';
import {
  getDrupalNodeDataFromPathAlias,
  getNodePath,
  findNodeAttributes,
  strToLang,
  getPageType,
} from "./helpers/helpers";
const fs = require("fs")
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../../build')));

app.use('/api', apiRouter);

app.get("/*", async (req, res) => {
  try {
    const url = req.path;
    const splittedUrl = url.split('/');
    const lang = strToLang(splittedUrl[1]);
    const urlAlias = url.slice(url.lastIndexOf('/') + 1);
    const nodeType = splittedUrl[2];

    const pageType = getPageType(nodeType, urlAlias);

    const { nid } =
      (await getDrupalNodeDataFromPathAlias(pageType, urlAlias, lang)) || {};

    const fetchUrl = getNodePath(pageType, lang, nid);

    const pageJson = await axios.get(fetchUrl);
    const nodeAttributes = await findNodeAttributes(pageJson.data, lang);
  
    const filePath = path.resolve(__dirname, '../../build/index.html')
    fs.readFile(filePath, 'utf8', function (err: any, data: any) {
      if (err) {
        return console.log(err);
      }
  
      if (nodeAttributes.title) {
        data = data.replace(/\$OG_TITLE/g, nodeAttributes.title);
      }
  
      if (nodeAttributes.summary) {
        data = data.replace(/\$OG_DESCRIPTION/g, nodeAttributes.summary);
      }
  
      if (nodeAttributes.imageUrl) {
        data = data.replace(/\$OG_IMAGE/g, nodeAttributes.imageUrl);
      }    
      res.send(data);
    });
  
  } catch (e) {
    console.error(e);
    res.sendFile(path.resolve(__dirname, '../../build/index.html'));
  }
})


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../build/index.html'));
});

const port = process.env.SERVER_PORT || 9000;
app.listen(port, () => {
  console.log("Server running on port", port);
});
