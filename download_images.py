import os
import urllib.request
from urllib.error import URLError, HTTPError
import time
import random

def download_image(url, filename, max_retries=3):
    for attempt in range(max_retries):
        try:
            print(f"正在下载 {filename}... (尝试 {attempt + 1}/{max_retries})")
            urllib.request.urlretrieve(url, filename)
            print(f"{filename} 下载成功!")
            return True
        except HTTPError as e:
            print(f"HTTP错误: {e.code} - {url}")
        except URLError as e:
            print(f"URL错误: {e.reason} - {url}")
        except Exception as e:
            print(f"下载失败 {url}: {str(e)}")
        
        if attempt < max_retries - 1:
            # 指数退避策略，随机延迟
            delay = (2 ** attempt) + random.uniform(0, 1)
            print(f"等待 {delay:.2f} 秒后重试...")
            time.sleep(delay)
    
    print(f"{filename} 下载失败，已达到最大重试次数")
    return False

def main():
    # 创建images目录如果不存在
    if not os.path.exists('images'):
        os.makedirs('images')
    
    # 图片URL和文件名映射 (使用Imgur作为默认源)
    images = {
        'https://i.imgur.com/yQb4G2Q.jpg': 'images/sun.jpg',
        'https://i.imgur.com/5C6X7A0.jpg': 'images/mercury.jpg',
        'https://i.imgur.com/pQaO8Lm.jpg': 'images/venus.jpg',
        'https://i.imgur.com/3M0zRMR.jpg': 'images/earth.jpg',
        'https://i.imgur.com/3xX8g3T.jpg': 'images/mars.jpg',
        'https://i.imgur.com/jjVHbUe.jpg': 'images/jupiter.jpg',
        'https://i.imgur.com/KGv27UQ.jpg': 'images/saturn.jpg',
        'https://i.imgur.com/5FgZbO6.jpg': 'images/uranus.jpg',
        'https://i.imgur.com/0jHn8yd.jpg': 'images/neptune.jpg'
    }
    
    # 下载所有图片
    failed_downloads = []
    for url, filename in images.items():
        if not download_image(url, filename):
            failed_downloads.append(filename)
    
    if failed_downloads:
        print("\n以下文件下载失败:")
        for filename in failed_downloads:
            print(f"- {filename}")
        print("\n请检查网络连接后重新运行此脚本，或者手动下载这些图片到images目录。")
    else:
        print("\n所有图片下载成功!")

if __name__ == "__main__":
    main()