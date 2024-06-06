用 node-crawler 爬取 csdn 上指定用户的所有文章（标题、摘要、分类、标签、正文、发布更新日期），并将结果输出到文件。

获取文章列表的接口会遇到网站的安全验证，node-crawler 无法自行处理，需要人工获取 cookie 辅助。

---

运行
```
node index.js
```
