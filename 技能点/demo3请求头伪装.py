import requests

# 请求头伪装：模拟真实浏览器行为，绕过基础 UA 检测
# 完整伪装通常包含 UA、Referer、Accept-Language 等多个字段

url = "https://quotes.toscrape.com/"

# 1. 构造完整的伪装请求头
headers = {
    # 浏览器标识
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
    # 来源页（让服务器以为是从搜索引擎过来的）
    "Referer": "https://www.google.com/",
    # 接收的语言
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    # 接收的内容类型
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    # 连接方式
    "Connection": "keep-alive",
}

# 2. 发送请求
response = requests.get(url=url, headers=headers)

# 3. 验证是否成功
print("状态码：", response.status_code)
print("页面标题预览：")
# 简单提取 title 看效果
import re
title = re.search(r"<title>(.*?)</title>", response.text)
if title:
    print(title.group(1))
