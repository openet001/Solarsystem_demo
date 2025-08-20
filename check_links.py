import urllib.request
import re

# 添加请求头避免403错误
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
request = urllib.request.Request('https://www.solarsystemscope.com/textures/', headers=headers)
response = urllib.request.urlopen(request)
data = response.read().decode('utf-8')

# 查找多种可能的纹理链接模式
patterns = [
    r'href="([^"]*2k_[^"]*)"',
    r'href="([^"]*\.jpg)"',
    r'href="([^"]*/textures/[^"]*)"',
    r'src="([^"]*2k_[^"]*)"',
    r'src="([^"]*\.jpg)"'
]

print("Found links:")
all_links = []
for pattern in patterns:
    links = re.findall(pattern, data)
    for link in links:
        if link not in all_links:
            all_links.append(link)
            print(link)

print(f"\nTotal unique links found: {len(all_links)}")