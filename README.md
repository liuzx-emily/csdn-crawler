用 node-crawler 爬取 csdn 上指定用户的所有文章（标题、摘要、分类、标签、html 格式的正文、发布更新日期），并将结果输出到文件。

获取文章列表的接口会遇到网站的安全验证，node-crawler 无法自行处理，需要人工获取 cookie 辅助。

相关文章：[《爬虫（没）入门：用 node-crawler 爬取 blog》](https://liuzx-emily.github.io/blog/#/post/0cd4b446-1654-4a1e-b7b2-f1b260c3fa4f)

---

运行
```
node index.js
```

