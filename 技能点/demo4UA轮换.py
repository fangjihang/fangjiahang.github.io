import requests
import random


# 1. 准备UA池
ua_pool = [
    "Mozilla/5.0 Chrome/120",
    "Mozilla/5.0 Firefox/120",
    "Mozilla/5.0 Edge/120"
]

# 2. 随机获取一个UA
ua = random.choice(ua_pool)

# 3. 放入请求头
headers = {
    "User-Agent": ua
}

# 4. 发送请求
url = "http://127.0.0.1:5000/ua"

response = requests.get(url,headers=headers)

print(response.text)