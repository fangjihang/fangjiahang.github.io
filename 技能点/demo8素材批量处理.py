import os
from PIL import Image

# 素材批量处理：对文件夹下所有图片做统一处理（压缩、改尺寸、加水印）
# 安装：pip install Pillow

# 1. 输入输出目录
input_dir = "input_images"
output_dir = "output_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 2. 目标尺寸
target_size = (800, 600)

# 3. 遍历目录下所有图片
count = 0
for filename in os.listdir(input_dir):
    if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
        continue

    input_path = os.path.join(input_dir, filename)
    output_path = os.path.join(output_dir, filename)

    # 4. 打开图片，按比例缩放并保存
    try:
        img = Image.open(input_path)
        img = img.convert("RGB")
        # 使用 thumbnail 等比缩放（不变形）
        img.thumbnail(target_size)
        # 质量压缩，控制文件大小
        img.save(output_path, "JPEG", quality=80)
        count += 1
        print(f"已处理：{filename}")
    except Exception as e:
        print(f"处理失败：{filename}，原因：{e}")

print(f"\n共处理 {count} 张图片")
