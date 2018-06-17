# pixiv-crawler

> pixiv-crawler is a reptile for a website which named pixiv

## Features

- 获取数据前要登录pixiv，可以使用 `--set-cookie` 保存 `PHPSESSID`，具体的值去浏览器查看

```bash
crawlP --set-cookie 'vfiy123_18237qde'
# or
crawlU --set-cookie 'vfiy123_18237qde'
```

如果 `PHPSESSID` 更新了，记得更新保存的 `PHPSESSID`

- 输入illust_id，爬取一张图片单张源图片

```bash
crawlP -i 67844926
```

- 输入url，爬取一张图片单张源图片

```bash
crawlP -u 67844926
```

- 指定输出路径

```bash
crawlP -i 67844926 -o '~/pixiv-imgs'
```

- 未指定输出文件夹时
  - 在运行命令的目录创建文件夹，名称中加入日期，如果是爬取作者页面的内容则在最后加入作者名称;
  - 日期格式: 2018-04-08
  - 文件夹名称: 日期 pixiv (i.e. "2018-04-08 pixiv")

- 指定文件名，{fn}代表图片的源文件名
```bash
crawlP -i 67844926 -n 'sometext{fn}sometext'
```

- 根据用户id分析用户的作品
  - 文件夹命名格式:(日期 pixiv 作者名称)
  - 爬取用户的作品或者收藏时提供以下可选项
  - 1：增加起始页和结束页设置
  - 2：增加爬取的图片个数个数限制
  - 3：可以设置只爬取某一页
  - 优先级：3>2>1

- 根据用户id获取所有作品

```bash
crawlU -i 3869665
```

- 根据url获取所有作品

```bash
crawlU -u 'https://www.pixiv.net/member.php?id=3869665'
```

- 根据用户id获取作品，限制数量为12张
```bash
crawlU -i 3869665 -c 12
```

- 根据用户id获取用户的所有公开的收藏
(获取id为3869665的用户的所有收藏
```bash
crawlU -i 3869665 -t 'bookmark'
```

- 根据用户id获取指定的某一页的图片（作品或收藏）
(获取id为3869665的用户的第二页作品
```bash
crawlU -i 3869665 -p 2
```

- 根据用户id获取从指定的页数开始的所有图片
(获取id为3869665的用户的第二页开始的作品
```bash
crawlU -i 3869665 -s 2
```

- 根据用户id获取到指定的页数为止的所有图片
(获取id为3869665的用户的第1页到第5页的作品
```bash
crawlU -i 3869665 -f 5
```

- 指定输出路径

```bash
crawlU -i 3869665 -o '~/pixiv-imgs'
```

- 未指定输出文件夹时
  - 在运行命令的目录创建文件夹，名称中加入日期，如果是爬取作者页面的内容则在最后加入作者名称;
  - 日期格式: 2018-04-08
  - 文件夹名称: 日期 pixiv 作者 (i.e. "2018-04-08 pixiv xxx")

- 指定文件名，{fn}代表图片的源文件名

```bash
crawlU -i 3869665 -n 'sometext{fn}sometext'
```

## Todos

- 分析特辑的图片数据
- 抓取图片页面的推荐图片数据
