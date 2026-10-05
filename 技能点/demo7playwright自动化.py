from playwright.sync_api import sync_playwright

# Playwright 是微软开源的新一代浏览器自动化框架
# 相比 Selenium：无需单独下载驱动、自带智能等待、API 更简洁
# 安装：pip install playwright
# 安装浏览器内核：playwright install

# 1. 启动 Playwright
with sync_playwright() as p:

    # 2. 创建浏览器对象（自带驱动，无需配置）
    # 支持 chromium / firefox / webkit
    browser = p.chromium.launch(headless=False)

    # 3. 新建页面
    page = browser.new_page()

    try:
        # 4. 访问目标页面（自带智能等待，无需 time.sleep）
        page.goto("https://quotes.toscrape.com/")

        # 5. 等待名言块出现
        page.wait_for_selector("div.quote")

        # 6. 用 CSS 选择器定位所有名言
        quotes = page.query_selector_all("div.quote")

        # 7. 提取文本和作者
        for q in quotes:
            text = q.query_selector("span.text").text_content()
            author = q.query_selector("small.author").text_content()
            print(f"[{author}] {text}")

    finally:
        # 8. 关闭浏览器
        browser.close()
