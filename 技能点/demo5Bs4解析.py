from bs4 import BeautifulSoup
import time
import requests
# 2. 定义请求网址
url = "https://movie.douban.com/top250"
# 3. 伪装请求，添加请求头
header = {
    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
}
# 4. 发送请求
response = requests.get(url=url,headers=header)

# 将响应的数据转为html结构
soup = BeautifulSoup(response.text,"html.parser")

# select('bs表达式')  查找所有符合条件的元素,返回一个列表
# select_one('bs表达式')   查找第一个符合条件的元素
items = soup.select('.item')
# items = soup.select_one('.item')

for item in items:
    # 电影名
    name = item.select_one('.title').text
    # 评分
    pingfen = item.select_one('.rating_num').text
    print(f'{name}的评分是{pingfen}')
