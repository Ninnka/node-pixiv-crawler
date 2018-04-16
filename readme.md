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

- 爬取用户的作品或者收藏时提供以下可选项
  - 1：增加起始页和结束页设置
  - 2：增加爬取的图片个数个数限制
  - 3：可以设置只爬取某一页
  - 优先级：3>2>1

- 自定义文件命名，以原文件名为基础（例如：原文件名为'filename=8371345_p0', '一些文本{fn}一些文本'，后缀为原文件的后缀，自定义文本里允许出现'.'）
- 例如：
```bash
fetchP -i 123456 -n iqwe{fn}dwqo
```

## Todos

- 分析特辑的图片数据
- 抓取图片页面的推荐图片数据
