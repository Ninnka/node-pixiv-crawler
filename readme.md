# pixiv-crawler

> pixiv-crawler is a reptile for a website which named pixiv

## Features

- 根据用户id分析用户的作品
- 根据用户id分析用户的收藏
- 输入illust_id，爬取一张图片单张源图片
- 输入图片的有效pixiv-url，解析出illust_id，爬出单张源图片
  - 支持图片源mode：medium, manga
- 文件夹命名格式:(日期 pixiv 作者名称)
- 未指定输出文件夹时
  - 在运行命令的目录创建文件夹，名称中加入日期，如果是爬取作者页面的内容则在最后加入作者名称;日期格式:(2018-04-08)，文件夹名称:(日期 pixiv 作者)
- 指定输出文件夹时
  - 输出文件到指定的文件夹

## Todos

- 分析特辑的图片数据
