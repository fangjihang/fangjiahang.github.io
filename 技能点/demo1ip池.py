import requests

# 使用熊猫ip:https://www.xiongmaodaili.com/
# 注册可送试用
# 账号：xiaoyan123
# 密码：xiaoyan123
# ip生效时间较短，访问https://www.xiongmaodaili.com/getapi，
# 选择订单->生成api链接->打开链接，重新获取有效ip

ip_pool = [
    "http://58.220.27.195:61002",
    "http://58.220.27.194:61954",
    "http://58.220.27.193:51999",
    "http://58.220.27.196:62085",
    "http://58.220.27.166:59609",
    "http://58.220.27.193:53481",
]

url = "http://myip.ipip.net"    # 返回ip相关内容

for ip in ip_pool:
    proxies = {"http": ip, "https": ip}
    try:
        resp = requests.get(url, proxies=proxies, timeout=3)
        print(f"[可用] {ip}  -> {resp.text}")
    except:
        print(f"[失效] {ip}")

