import asyncio
import os
from edge_tts import VoicesManager, Communicate

# 要生成的字母列表（用于双n-back游戏）
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
           'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

async def list_voices():
    voices_manager = await VoicesManager.create()
    voices = voices_manager.voices
    english_voices = []
    
    for voice in voices:
        if 'en-US' in voice["Locale"]:
            english_voices.append(voice)
    
    return english_voices

async def regenerate_all_male_letters():
    english_voices = await list_voices()
    
    # 使用11号男声索引
    male_voice_idx = 11
    
    if 0 <= male_voice_idx < len(english_voices):
        voice = english_voices[male_voice_idx]
        gender_folder = "male"
        
        # 创建输出目录
        output_dir = f"public/games/dual-n-back/audio/{gender_folder}/"
        os.makedirs(output_dir, exist_ok=True)
        
        print(f"使用男声 {voice['Name']} ({voice['ShortName']}) 重新生成所有字母音频...")
        
        # 生成所有字母音频
        for letter in letters:
            file_path = f"{output_dir}{letter}.mp3"
            print(f"Regenerating {file_path}...")
            
            communicate = Communicate(letter, voice["ShortName"])
            await communicate.save(file_path)
            # 添加短暂延迟，确保文件写入完成
            await asyncio.sleep(0.5)
        
        print(f"所有男声字母音频文件已使用新的声音成功重新生成!")
    else:
        print(f"无效的男声索引! 索引 {male_voice_idx} 超出范围。")

if __name__ == "__main__":
    asyncio.run(regenerate_all_male_letters()) 