import asyncio
import os
from edge_tts import VoicesManager, Communicate

# 麻将牌的中文读音映射
mahjong_tiles_chinese = {
    # 数字牌 (万、条、饼)
    "1m": "一万",
    "2m": "二万",
    "3m": "三万",
    "4m": "四万",
    "5m": "五万",
    "6m": "六万",
    "7m": "七万",
    "8m": "八万",
    "9m": "九万",
    
    "1s": "一条",
    "2s": "二条",
    "3s": "三条",
    "4s": "四条",
    "5s": "五条",
    "6s": "六条",
    "7s": "七条",
    "8s": "八条",
    "9s": "九条",
    
    "1p": "一饼",
    "2p": "二饼",
    "3p": "三饼",
    "4p": "四饼",
    "5p": "五饼",
    "6p": "六饼",
    "7p": "七饼",
    "8p": "八饼",
    "9p": "九饼",
    
    # 风牌 (东南西北)
    "east": "东风",
    "south": "南风",
    "west": "西风",
    "north": "北风",
    
    # 三元牌 (中发白)
    "red": "红中",
    "green": "发财",
    "white": "白板",
    
    # 花牌 (春夏秋冬)
    "spring": "春",
    "summer": "夏",
    "autumn": "秋",
    "winter": "冬",
    
    # 花牌 (梅兰竹菊)
    "plum": "梅",
    "orchid": "兰",
    "bamboo": "竹",
    "chrysanthemum": "菊"
}

async def list_voices():
    voices_manager = await VoicesManager.create()
    voices = voices_manager.voices
    chinese_voices = []
    
    print("可用的中文女声列表:")
    for i, voice in enumerate(voices):
        if 'zh-CN' in voice["Locale"] and voice["Gender"] == "Female":
            chinese_voices.append(voice)
            idx = len(chinese_voices) - 1
            print(f"Voice {idx}:")
            print(f" - Name: {voice['Name']}")
            print(f" - ShortName: {voice['ShortName']}")
            print(f" - Gender: {voice['Gender']}")
            print(f" - Locale: {voice['Locale']}")
    
    return chinese_voices

async def generate_mahjong_chinese_audio():
    chinese_voices = await list_voices()
    
    if not chinese_voices:
        print("没有找到可用的中文女声!")
        return
    
    # 默认使用第一个中文女声
    voice_idx = 0
    
    # 如果有多个中文女声，让用户选择
    if len(chinese_voices) > 1:
        voice_idx = int(input(f"\n请选择要使用的中文女声 (0-{len(chinese_voices)-1}): "))
        if not (0 <= voice_idx < len(chinese_voices)):
            print("无效的声音索引!")
            return
    
    voice = chinese_voices[voice_idx]
    
    # 创建输出目录
    output_dir = "public/games/mahjong-dual-n-back/audio/chinese_female/"
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"\n使用中文女声 {voice['Name']} ({voice['ShortName']}) 生成麻将牌音频...")
    
    # 生成麻将牌音频
    for tile_code, pronunciation in mahjong_tiles_chinese.items():
        file_path = f"{output_dir}{tile_code}.mp3"
        print(f"生成 {file_path}... ({pronunciation})")
        
        communicate = Communicate(pronunciation, voice["ShortName"])
        await communicate.save(file_path)
        # 添加短暂延迟，确保文件写入完成
        await asyncio.sleep(0.5)
    
    print(f"所有麻将牌中文女声音频文件已成功生成!")

if __name__ == "__main__":
    asyncio.run(generate_mahjong_chinese_audio()) 