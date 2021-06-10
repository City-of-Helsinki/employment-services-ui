import axios from "axios";
import { getClient } from "./elasticsearchClient";
import { fetchFiles, fetchImages, getPagePath, findNodeData } from './helpers';
import { NodeData } from "./types";

async function fetchBlogs() {
  const drupalUrl = process.env.DRUPAL_URL;
  if (!drupalUrl) {
    throw "Set DRUPAL_URL";
  }

  const [fiBlogsUrl, svBlogsUrl, enBlogsUrl] = getPagePath(
    drupalUrl,
    "/node/blog",
    "?include=field_page_content",
  );

  const [fi, sv, en, files, media] = await Promise.all([axios.get(fiBlogsUrl), axios.get(svBlogsUrl), axios.get(enBlogsUrl), fetchFiles(drupalUrl), fetchImages(drupalUrl)]);

  const data = fi.data;
  if (!data) {
    throw "Error fetcing drupal blogs, no data in res";
  }

  const nodeData: NodeData = {
    fi: findNodeData(fi.data, files, media),
    en: findNodeData(en.data, files, media),
    sv: findNodeData(sv.data, files, media),
  };

  return nodeData;
}

export const syncElasticSearchBlogs = async () => {
  const client = getClient();

  try {
    await Promise.all([await client.indices.delete({ index: "blogs-fi" }), await client.indices.delete({ index: "blogs-sv" }), await client.indices.delete({ index: "blogs-en" })]);
  } catch (err) {
    console.warn("WARNING when deleting 'blogs' index: " + err);
  }

  const newIndex = (name: string) => {
    return {
      index: name,
      body: {
        mappings: {
          properties: {
            id: { type: 'text' },
            path: { type: "text" },
            date: { type: "date" },
            title: { type: "text" },
            imageUrl: { type: "text" },
            alt: { type: "text" },
            summary: { type: "text" },
          },
        },
      },
    }
  };

  try {
    await Promise.all([client.indices.create(newIndex('blogs-fi'),{ ignore: [400] }), client.indices.create(newIndex('blogs-sv'),{ ignore: [400] }), client.indices.create(newIndex('blogs-en'),{ ignore: [400] })]);
  } catch (err) {
    console.log("ERROR", err);
    return;
  }

  const blogs = await fetchBlogs();
  
  const dataset = Object.keys(blogs).map((k: any) => {
    return blogs[k].flatMap((doc: any) => [{ index: { _index: "blogs-" + k } }, doc]);
  });

  const body = dataset.flatMap((doc: any) => doc);
  const { body: bulkResponse } = await client.bulk({ refresh: true, body });
  const [{ body: fiBody }, { body: svBody }, { body: enBody }] = await Promise.all([client.count({ index: "blogs-fi" }), client.count({ index: "blogs-sv" }), client.count({ index: "blogs-en" })]);
  console.log("blogs-fi added:", fiBody.count);
  console.log("blogs-sv added:", svBody.count);
  console.log("blogs-en added:", enBody.count);
};
