import requests

# AI 大模型应用：实现一个能连续对话的 AI 助手
# 演示：通过 while 循环不断接收用户输入，调用大模型 API 进行回复

# 1. 配置 API Key 与接口地址（以智谱 GLM 为例）
api_key = "ec813646f4dc48ad901c45bb2c861cc7.MdNKt2mWxVKDHpo3"
url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

# 2. 准备请求头
headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# 3. 保存对话历史，让 AI 能记住上文
messages = [
    {
        "role": "system",
        "content": "你是一个友好的 AI 助手，请简洁地回答用户的问题。"
    }
]

print("AI 助手已上线，输入 '退出' 结束对话。")

# 4. 开始对话循环
while True:
    user_input = input("你：")
    if user_input == "退出":
        print("对话结束，再见！")
        break

    # 把用户的话加入对话历史
    messages.append({"role": "user", "content": user_input})
    # 构造请求
    payload = {
        "model": "glm-4",
        "messages": messages
    }

    # 调用大模型并解析回复
    try:
        response = requests.post(url=url, headers=headers, json=payload)
        result = response.json()
        answer = result["choices"][0]["message"]["content"]
        print("AI：", answer)
        # 把 AI 的回复也加入历史，保持上下文连贯
        messages.append({"role": "assistant", "content": answer})
    except Exception as e:
        print("请求出错：", e)
