import asyncio
import os
import time
from edge_tts import VoicesManager, Communicate

# 要生成的字母列表
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
           'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

# 获取并显示所有可用的英语声音
async def list_voices():
    voices_manager = await VoicesManager.create()
    voices = voices_manager.voices
    english_voices = []
    
    print("可用的英语声音列表:")
    for i, voice in enumerate(voices):
        if 'en-US' in voice["Locale"]:
            english_voices.append(voice)
            idx = len(english_voices) - 1
            print(f"Voice {idx}:")
            print(f" - Name: {voice['Name']}")
            print(f" - ShortName: {voice['ShortName']}")
            print(f" - Gender: {voice['Gender']}")
            print(f" - Locale: {voice['Locale']}")
    
    return english_voices

# 预览功能
async def preview_voice(voice, text="This is a sample of how this voice sounds."):
    """预览指定的声音"""
    print(f"\n正在预览: {voice['Name']}")
    communicate = Communicate(text, voice["ShortName"])
    await communicate.save("preview.mp3")
    
    # 使用系统命令播放音频
    if os.name == 'nt':  # Windows
        os.system("start preview.mp3")
    elif os.name == 'posix':  # macOS 或 Linux
        os.system("open preview.mp3 || xdg-open preview.mp3")
    
    # 等待音频播放完毕
    await asyncio.sleep(2)

# 预览字母发音
async def preview_letters(voice, letters):
    """预览指定声音的字母发音"""
    print(f"\n正在使用 {voice['Name']} 预览字母发音:")
    for letter in letters:
        print(f"发音字母: {letter}")
        communicate = Communicate(letter, voice["ShortName"])
        await communicate.save("preview_letter.mp3")
        
        # 使用系统命令播放音频
        if os.name == 'nt':  # Windows
            os.system("start preview_letter.mp3")
        elif os.name == 'posix':  # macOS 或 Linux
            os.system("open preview_letter.mp3 || xdg-open preview_letter.mp3")
        
        # 等待音频播放完毕
        await asyncio.sleep(1.5)

# 生成所有音频文件
async def generate_audio_files(voice, gender_folder):
    """生成所有音频文件"""
    # 创建输出目录
    output_dir = f"public/games/dual-n-back/audio/{gender_folder}/"
    os.makedirs(output_dir, exist_ok=True)
    
    # 生成字母音频
    for letter in letters:
        file_path = f"{output_dir}{letter}.mp3"
        print(f"Generating {file_path}...")
        
        communicate = Communicate(letter, voice["ShortName"])
        await communicate.save(file_path)
        # 添加短暂延迟，确保文件写入完成
        await asyncio.sleep(0.5)
    
    print(f"All audio files for {gender_folder} voice generated successfully!")

# 主程序
async def main():
    english_voices = await list_voices()
    
    # 女声索引 6
    female_voice_idx = 6
    if 0 <= female_voice_idx < len(english_voices):
        print(f"\n使用女声 {english_voices[female_voice_idx]['Name']} 生成音频...")
        await generate_audio_files(english_voices[female_voice_idx], "female")
    else:
        print("无效的女声索引!")
    
    # 男声索引 16
    male_voice_idx = 16
    if 0 <= male_voice_idx < len(english_voices):
        print(f"\n使用男声 {english_voices[male_voice_idx]['Name']} 生成音频...")
        await generate_audio_files(english_voices[male_voice_idx], "male")
    else:
        print("无效的男声索引!")
    
    print("\n所有音频文件生成完成!")

# 运行主程序
if __name__ == "__main__":
    asyncio.run(main())
