import base64
import json
import requests

# 参数逆向解密：网站对请求参数做加密处理，需要逆向分析加密逻辑
# 常见方式：Base64、AES、RSA、自定义混淆等

# 演示：对参数做 Base64 加密/解密
# 实战中需要结合浏览器调试分析加密函数

# 1. 原始参数（要发送的数据）
params = {"page": 1, "size": 10, "keyword": "python"}

# 2. 将参数序列化为 JSON 字符串
json_str = json.dumps(params)

# 3. 加密：Base64 编码（实战中可能是 AES 等更复杂的算法）
encrypted = base64.b64encode(json_str.encode("utf-8")).decode("utf-8")
print("加密后参数：", encrypted)

# 4. 服务器接收到加密参数后解密
decoded = base64.b64decode(encrypted).decode("utf-8")
restored = json.loads(decoded)
print("解密后参数：", restored)

# 5. 实际请求示例
# headers = {"User-Agent": "..."}
# response = requests.get("https://example.com/api", params={"data": encrypted}, headers=headers)
