const Crawler = require("crawler");
const { writeFile } = require("fs");
const { username, cookie_yd_captcha_token, cookie_waf_captcha_marker } = require("./configs.js");

const crawler = new Crawler();

// https://github.com/request/request
// https://github.com/bda-research/node-crawler/tree/master?tab=readme-ov-file#basic-usage
// https://github.com/cheeriojs/cheerio/wiki/Chinese-README

const articleList = [];

function getArticleList() {
  let url = "https://blog.csdn.net/community/home-api/v1/get-business-list";
  const queryParams = {
    businessType: "blog",
    username,
    page: 1,
    size: 1000,
  };
  url +=
    "?" +
    Object.entries(queryParams)
      .map(([key, value]) => key + "=" + value)
      .join("&");
  return new Promise((resolve, reject) => {
    crawler.direct({
      uri: url,
      headers: {
        Cookie: `yd_captcha_token=${cookie_yd_captcha_token}; waf_captcha_marker=${cookie_waf_captcha_marker}`,
      },
      callback: (error, res) => {
        if (error) {
          reject(error);
        } else {
          const { code, data, message } = JSON.parse(res.body);
          if (code === 200) {
            resolve(data);
          } else {
            reject({ code, message });
          }
        }
      },
    });
  });
}

function getArticleDetail(articleId) {
  return new Promise((resolve, reject) => {
    crawler.direct({
      uri: `https://blog.csdn.net/${username}/article/details/${articleId}`,
      callback: (error, res) => {
        if (error) {
          reject(error);
        } else {
          const $ = res.$;
          const title = $("#articleContentId").text();
          const content = $("#article_content").text();
          const categories = $(`.tag-link[href^="https://blog.csdn.net"]`)
            .map((_i, el) => $(el).text())
            .get();
          const tags = $(`.tag-link[href^="https://so.csdn.net/so/search"]`)
            .map((_i, el) => $(el).text())
            .get();
          const articleDetail = {
            title,
            categories,
            tags,
            content,
          };
          resolve(articleDetail);
        }
      },
    });
  });
}

async function start() {
  const { list } = await getArticleList();

  for (let i = 0; i < list.length; i++) {
    const { articleId, description, formatTime, postTime, title } = list[i];
    const { categories, tags, content } = await getArticleDetail(articleId);
    articleList.push({
      articleId,
      title,
      description,
      categories,
      tags,
      content,
      postTime,
      formatTime,
    });
  }
  outputToJson();
}

function outputToJson() {
  const path = "./result.json";

  writeFile(path, JSON.stringify(articleList), (error) => {
    if (error) {
      console.log("An error has occurred ", error);
      return;
    }
    console.log("Data written successfully to disk");
  });
}
start();
