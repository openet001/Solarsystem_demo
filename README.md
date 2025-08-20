english version still in coding work....

# 太阳系模拟器

这是一个使用Three.js创建的三维太阳系模拟器。它模拟了太阳和八大行星的运行，支持鼠标交互，可以从不同角度观察太阳系。

## 功能特点
- 三维星空背景
- 太阳和八大行星的真实大小比例
- 行星的公转和自转
- 鼠标交互控制（拖动旋转、滚轮缩放）
- 即使无法加载纹理图片，也会显示彩色行星
- 太阳添加了明亮的红色闪烁耀斑效果
- 土星拥有多层白色圆环，外层粗内层细
- 地球添加了月球卫星，围绕地球旋转并自转
- 行星标签显示，便于识别各个天体

  

## 使用方法
直接打开index.html 或者


1. 确保已安装Python
2. 在项目目录下运行以下命令启动本地服务器：
   ```
   python -m http.server 8000
   ```
3. 在浏览器中打开：http://localhost:8000

## 解决图片加载问题
如果您遇到图片加载错误（ERR_CONNECTION_REFUSED），可以尝试以下方法：

### 方法1：使用本地图片
1. 创建一个名为`textures`的文件夹
2. 下载以下图片到该文件夹：
   - 太阳: https://i.imgur.com/yQb4G2Q.jpg
   - 水星: https://i.imgur.com/5C6X7A0.jpg
   - 金星: https://i.imgur.com/pQaO8Lm.jpg
   - 地球: https://i.imgur.com/3M0zRMR.jpg
   - 火星: https://i.imgur.com/3xX8g3T.jpg
   - 木星: https://i.imgur.com/jjVHbUe.jpg
   - 土星: https://i.imgur.com/KGv27UQ.jpg
   - 天王星: https://i.imgur.com/5FgZbO6.jpg
   - 海王星: https://i.imgur.com/0jHn8yd.jpg
3. 修改`solar-system.js`文件中的图片路径，例如将`https://i.imgur.com/yQb4G2Q.jpg`改为`textures/yQb4G2Q.jpg`

### 方法2：从Solar System Scope下载纹理
1. 访问Solar System Scope纹理页面：https://www.solarsystemscope.com/textures/
2. 该网站提供2K、4K、8K分辨率的太阳系星球贴图资源
3. 如果无法直接下载，可以使用以下替代链接：
   - 天翼网盘打包下载：https://cloud.189.cn/web/share?code=lbv1（访问码：lbv1）
   - 注意：需要注册天翼网盘账号才能下载

### 方法3：手动下载纹理
如果自动下载脚本无法正常工作，您可以手动下载纹理图片：
1. 访问以下Imgur链接下载对应的纹理图片：
   - 太阳: https://i.imgur.com/yQb4G2Q.jpg
   - 水星: https://i.imgur.com/5C6X7A0.jpg
   - 金星: https://i.imgur.com/pQaO8Lm.jpg
   - 地球: https://i.imgur.com/3M0zRMR.jpg
   - 火星: https://i.imgur.com/3xX8g3T.jpg
   - 木星: https://i.imgur.com/jjVHbUe.jpg
   - 土星: https://i.imgur.com/KGv27UQ.jpg
   - 天王星: https://i.imgur.com/5FgZbO6.jpg
   - 海王星: https://i.imgur.com/0jHn8yd.jpg
2. 将下载的图片保存到项目的`images`文件夹中
3. 确保文件名与上述链接中的文件名一致

### 方法4：使用离线模式
如果您不需要查看真实纹理，可以直接使用彩色行星模式，这是默认启用的。

## 技术栈
- HTML5
- CSS3
- JavaScript
- Three.js
