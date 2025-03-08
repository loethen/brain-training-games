import asyncio
import os
from edge_tts import VoicesManager, Communicate

async def list_voices():
    voices_manager = await VoicesManager.create()
    voices = voices_manager.voices
    english_voices = []
    
    for voice in voices:
        if 'en-US' in voice["Locale"]:
            english_voices.append(voice)
    
    return english_voices

async def regenerate_m_letter():
    english_voices = await list_voices()
    
    # 男声索引 16 (与原脚本保持一致)
    male_voice_idx = 11
    
    if 0 <= male_voice_idx < len(english_voices):
        voice = english_voices[male_voice_idx]
        gender_folder = "male"
        letter = "m"
        
        # 创建输出目录
        output_dir = f"public/games/dual-n-back/audio/{gender_folder}/"
        os.makedirs(output_dir, exist_ok=True)
        
        file_path = f"{output_dir}{letter}.mp3"
        print(f"Regenerating {file_path}...")
        
        # 使用更清晰的发音方式
        communicate = Communicate(letter, voice["ShortName"])
        await communicate.save(file_path)
        
        print(f"Letter '{letter}' audio file for {gender_folder} voice regenerated successfully!")
        print(f"Voice used: {voice['Name']} ({voice['ShortName']})")
    else:
        print("无效的男声索引!")

if __name__ == "__main__":
    asyncio.run(regenerate_m_letter()) 