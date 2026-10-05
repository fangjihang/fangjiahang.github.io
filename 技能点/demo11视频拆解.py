from moviepy import VideoFileClip
import os

# 视频拆解：把视频拆成音频 + 多张图片，便于后续分析
# 安装：pip install moviepy

# 1. 视频文件路径（用任意本地小视频测试）
video_path = "技能点所需素材/sample.mp4"

# 2. 加载视频文件
clip = VideoFileClip(video_path)

# 3. 拆解音频
audio_path = "audio.mp3"
clip.audio.write_audiofile(audio_path)
print(f"已提取音频：{audio_path}")

# 4. 按时间间隔截图，保存为图片
# 这里每 2 秒截一张
duration = int(clip.duration)
output_dir = "frames"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

count = 0
for t in range(0, duration, 2):
    frame_path = f"{output_dir}/frame_{count:03d}.jpg"
    clip.save_frame(frame_path, t=t)
    count += 1

print(f"共截取 {count} 张图片到 {output_dir}/")

# 5. 释放资源
clip.close()
