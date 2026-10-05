# 京东价格监测代码，可配合Trae Work实现定时采集
# Trae Work提示词: 文件路径为D:\xxx\demo6定时采集.py，帮我设置每天10分钟循环监控一次

from DrissionPage import ChromiumPage
# 微信推送工具：通过Server酱实现消息推送
# 安装方式：pip install serverchan_sdk
# 使用前需在 https://sct.ftqq.com/ 注册账号获取sendkey
from serverchan_sdk import sc_send
import time


#设置一下你期待价格的值
ideal_price = 4500
# 待监控的京东商品链接列表
product_urls = [
    "https://item.jd.com/100359969926.html",
    "https://item.jd.com/100105522236.html",
    "https://item.jd.com/100257373973.html"
]

#创建浏览器对象
page = ChromiumPage()

#遍历所有商品链接，获取商品数据
for p_url in product_urls:
    #打开商品链接
    page.get(p_url)
    time.sleep(2)
    #定位元素的标题
    title = page.ele('xpath://span[@class="sku-title-name"]').text
    #有点长，取前10个字
    title = title[:10]
    #获取商品价格 这是一个字符串
    price = page.ele('xpath://span[@class="product-price--value"]').text
    print(f'你关注的商品{title}的价格是{price}')
    #如果你要提取的内容是一个热搜，而不是价格怎么办？？
    #先获取一次当前的热搜内容，然后比对一下，字符串有没有发生变化就行了。如果字符串变化了，就是更新热搜了
    if float(price) < ideal_price:
        print('低于理想价格，请立即入手')
        sc_send(
            # sendkey：在 https://sct.ftqq.com/ 登录后获取
            # 消息会推送到绑定的微信账号
            "SCT383773TtizsvkvyWGtUlDobeymihyMF",
            # 推送消息的标题
            f"你关注的{title}已降价",
            # 推送消息的描述信息，包含商品链接方便快速访问
            f"点击立即购买{p_url}"
        )
    else:
        print('价格高于理想价格，暂不购买')
    #灯带5秒，防止京东的反爬机制
    page.wait(5)

#最后关闭浏览器
page.quit()