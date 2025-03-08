import asyncio
import os
import time
from edge_tts import VoicesManager, Communicate

# 要生成的字母列表（用于双n-back游戏）
letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 
           'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

# 麻将牌的读音映射 (适用于上海麻将/Mahjong Solitaire)
mahjong_tiles = {
    # 数字牌 (万、条、饼)
    "1m": "one character",
    "2m": "two character",
    "3m": "three character",
    "4m": "four character",
    "5m": "five character",
    "6m": "six character",
    "7m": "seven character",
    "8m": "eight character",
    "9m": "nine character",
    
    "1s": "one bamboo",
    "2s": "two bamboo",
    "3s": "three bamboo",
    "4s": "four bamboo",
    "5s": "five bamboo",
    "6s": "six bamboo",
    "7s": "seven bamboo",
    "8s": "eight bamboo",
    "9s": "nine bamboo",
    
    "1p": "one dot",
    "2p": "two dot",
    "3p": "three dot",
    "4p": "four dot",
    "5p": "five dot",
    "6p": "six dot",
    "7p": "seven dot",
    "8p": "eight dot",
    "9p": "nine dot",
    
    # 风牌 (东南西北)
    "east": "east wind",
    "south": "south wind",
    "west": "west wind",
    "north": "north wind",
    
    # 三元牌 (中发白)
    "red": "red dragon",
    "green": "green dragon",
    "white": "white dragon",
    
    # 花牌 (春夏秋冬)
    "spring": "spring",
    "summer": "summer",
    "autumn": "autumn",
    "winter": "winter",
    
    # 花牌 (梅兰竹菊)
    "plum": "plum blossom",
    "orchid": "orchid",
    "bamboo": "bamboo flower",
    "chrysanthemum": "chrysanthemum"
}

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

# 预览麻将牌发音
async def preview_mahjong_tiles(voice, tiles_dict):
    """预览指定声音的麻将牌发音"""
    print(f"\n正在使用 {voice['Name']} 预览麻将牌发音:")
    for tile_code, pronunciation in list(tiles_dict.items())[:5]:  # 只预览前5个
        print(f"麻将牌: {tile_code} - 发音: {pronunciation}")
        communicate = Communicate(pronunciation, voice["ShortName"])
        await communicate.save("preview_tile.mp3")
        
        # 使用系统命令播放音频
        if os.name == 'nt':  # Windows
            os.system("start preview_tile.mp3")
        elif os.name == 'posix':  # macOS 或 Linux
            os.system("open preview_tile.mp3 || xdg-open preview_tile.mp3")
        
        # 等待音频播放完毕
        await asyncio.sleep(2)

# 生成双n-back游戏的字母音频文件
async def generate_letter_audio_files(voice, gender_folder):
    """生成双n-back游戏的字母音频文件"""
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
    
    print(f"All letter audio files for {gender_folder} voice generated successfully!")

# 生成麻将牌的音频文件
async def generate_mahjong_audio_files(voice, gender_folder):
    """生成麻将牌的音频文件"""
    # 创建输出目录
    output_dir = f"public/games/mahjong-dual-n-back/audio/{gender_folder}/"
    os.makedirs(output_dir, exist_ok=True)
    
    # 生成麻将牌音频
    for tile_code, pronunciation in mahjong_tiles.items():
        file_path = f"{output_dir}{tile_code}.mp3"
        print(f"Generating {file_path}...")
        
        communicate = Communicate(pronunciation, voice["ShortName"])
        await communicate.save(file_path)
        # 添加短暂延迟，确保文件写入完成
        await asyncio.sleep(0.5)
    
    print(f"All mahjong tile audio files for {gender_folder} voice generated successfully!")

# 重新生成特定字母的音频文件
async def regenerate_specific_letter(voice, gender_folder, letter):
    """重新生成特定字母的音频文件"""
    # 创建输出目录
    output_dir = f"public/games/dual-n-back/audio/{gender_folder}/"
    os.makedirs(output_dir, exist_ok=True)
    
    file_path = f"{output_dir}{letter}.mp3"
    print(f"Regenerating {file_path}...")
    
    communicate = Communicate(letter, voice["ShortName"])
    await communicate.save(file_path)
    
    print(f"Letter '{letter}' audio file for {gender_folder} voice regenerated successfully!")

# 主程序
async def main():
    english_voices = await list_voices()
    
    # 女声索引 6
    female_voice_idx = 6
    # 男声索引 16
    male_voice_idx = 16
    
    # 选择要生成的音频类型
    print("\n请选择要生成的音频类型:")
    print("1. 双n-back游戏字母音频 (男声和女声)")
    print("2. 麻将牌音频 (男声和女声)")
    print("3. 两种都生成 (男声和女声)")
    print("4. 只生成麻将牌男声音频")
    print("5. 只生成麻将牌女声音频")
    print("6. 预览声音")
    print("7. 重新生成特定字母音频")
    
    choice = input("请输入选项 (1-7): ")
    
    if choice == "1" or choice == "3":
        # 生成双n-back游戏字母音频
        if 0 <= female_voice_idx < len(english_voices):
            print(f"\n使用女声 {english_voices[female_voice_idx]['Name']} 生成字母音频...")
            await generate_letter_audio_files(english_voices[female_voice_idx], "female")
        else:
            print("无效的女声索引!")
        
        if 0 <= male_voice_idx < len(english_voices):
            print(f"\n使用男声 {english_voices[male_voice_idx]['Name']} 生成字母音频...")
            await generate_letter_audio_files(english_voices[male_voice_idx], "male")
        else:
            print("无效的男声索引!")
    
    if choice == "2" or choice == "3":
        # 生成麻将牌音频 (男声和女声)
        if 0 <= female_voice_idx < len(english_voices):
            print(f"\n使用女声 {english_voices[female_voice_idx]['Name']} 生成麻将牌音频...")
            await generate_mahjong_audio_files(english_voices[female_voice_idx], "female")
        else:
            print("无效的女声索引!")
        
        if 0 <= male_voice_idx < len(english_voices):
            print(f"\n使用男声 {english_voices[male_voice_idx]['Name']} 生成麻将牌音频...")
            await generate_mahjong_audio_files(english_voices[male_voice_idx], "male")
        else:
            print("无效的男声索引!")
    
    if choice == "4":
        # 只生成麻将牌男声音频
        if 0 <= male_voice_idx < len(english_voices):
            print(f"\n使用男声 {english_voices[male_voice_idx]['Name']} 生成麻将牌音频...")
            await generate_mahjong_audio_files(english_voices[male_voice_idx], "male")
        else:
            print("无效的男声索引!")
    
    if choice == "5":
        # 只生成麻将牌女声音频
        if 0 <= female_voice_idx < len(english_voices):
            print(f"\n使用女声 {english_voices[female_voice_idx]['Name']} 生成麻将牌音频...")
            await generate_mahjong_audio_files(english_voices[female_voice_idx], "female")
        else:
            print("无效的女声索引!")
    
    if choice == "6":
        # 预览声音
        voice_idx = int(input("\n请输入要预览的声音索引: "))
        if 0 <= voice_idx < len(english_voices):
            await preview_voice(english_voices[voice_idx])
            
            preview_type = input("\n预览类型 (1: 字母, 2: 麻将牌): ")
            if preview_type == "1":
                await preview_letters(english_voices[voice_idx], letters[:5])  # 只预览前5个字母
            elif preview_type == "2":
                await preview_mahjong_tiles(english_voices[voice_idx], mahjong_tiles)
        else:
            print("无效的声音索引!")
    
    if choice == "7":
        # 重新生成特定字母音频
        gender = input("\n请选择性别 (male/female): ").lower()
        letter = input("请输入要重新生成的字母: ").lower()
        
        if letter not in letters:
            print(f"无效的字母! 有效字母为: {', '.join(letters)}")
        else:
            voice_idx = male_voice_idx if gender == "male" else female_voice_idx
            if 0 <= voice_idx < len(english_voices):
                print(f"\n使用{gender}声 {english_voices[voice_idx]['Name']} 重新生成字母 '{letter}' 音频...")
                await regenerate_specific_letter(english_voices[voice_idx], gender, letter)
            else:
                print("无效的声音索引!")
    
    print("\n所有音频文件生成完成!")

# 运行主程序
if __name__ == "__main__":
    asyncio.run(main())
