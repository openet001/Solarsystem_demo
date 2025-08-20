# 太阳系模拟器 / Solar System Simulator

请 在release 下载最新版本（Lates version in release.）

这是一个使用Three.js创建的三维太阳系模拟器。它模拟了太阳和八大行星的运行，支持鼠标交互，可以从不同角度观察太阳系。

This is a 3D solar system simulator created with Three.js. It simulates the movement of the Sun and eight planets, supports mouse interaction, and allows observation of the solar system from different angles.

## 功能特点 / Features
- 三维星空背景 / 3D starry sky background
- 太阳和八大行星的真实大小比例 / Real size ratio of the Sun and eight planets
- 行星的公转和自转 / Revolution and rotation of planets
- 鼠标交互控制（拖动旋转、滚轮缩放） / Mouse interaction control (drag to rotate, scroll to zoom)
- 即使无法加载纹理图片，也会显示彩色行星 / Color planets displayed even if texture images cannot be loaded
- 太阳添加了明亮的红色闪烁耀斑效果 / Sun with bright red flickering flare effect
- 土星拥有多层白色圆环，外层粗内层细 / Saturn with multiple white rings, thicker outer layer and thinner inner layer
- 地球添加了月球卫星，围绕地球旋转并自转 / Earth with Moon satellite, rotating around Earth and spinning
- 行星标签显示，便于识别各个天体 / Planet labels for easy identification of celestial bodies
- 中英文界面切换功能 / Chinese and English interface switching function

## 使用方法 / Usage
直接打开index.html文件即可 / Simply open the index.html file or:
1. 确保已安装Python / Make sure Python is installed
2. 在项目目录下运行以下命令启动本地服务器： / Run the following command in the project directory to start a local server:
   ```
   python -m http.server 8000
   ```
3. 在浏览器中打开：http://localhost:8000 / Open in browser: http://localhost:8000
4. 点击右上角的"English"或"中文"按钮切换界面语言 / Click the "English" or "中文" button in the upper right corner to switch interface language

## 解决图片加载问题 / Solving Image Loading Issues
如果您遇到图片加载错误（ERR_CONNECTION_REFUSED），可以尝试以下方法：

If you encounter image loading errors (ERR_CONNECTION_REFUSED), you can try the following methods:

### 方法1：使用本地图片 / Method 1: Use Local Images
1. 创建一个名为`textures`的文件夹 / Create a folder named `textures`
2. 下载以下图片到该文件夹： / Download the following images to this folder:
   - 太阳: https://i.imgur.com/yQb4G2Q.jpg / Sun: https://i.imgur.com/yQb4G2Q.jpg
   - 水星: https://i.imgur.com/5C6X7A0.jpg / Mercury: https://i.imgur.com/5C6X7A0.jpg
   - 金星: https://i.imgur.com/pQaO8Lm.jpg / Venus: https://i.imgur.com/pQaO8Lm.jpg
   - 地球: https://i.imgur.com/3M0zRMR.jpg / Earth: https://i.imgur.com/3M0zRMR.jpg
   - 火星: https://i.imgur.com/3xX8g3T.jpg / Mars: https://i.imgur.com/3xX8g3T.jpg
   - 木星: https://i.imgur.com/jjVHbUe.jpg / Jupiter: https://i.imgur.com/jjVHbUe.jpg
   - 土星: https://i.imgur.com/KGv27UQ.jpg / Saturn: https://i.imgur.com/KGv27UQ.jpg
   - 天王星: https://i.imgur.com/5FgZbO6.jpg / Uranus: https://i.imgur.com/5FgZbO6.jpg
   - 海王星: https://i.imgur.com/0jHn8yd.jpg / Neptune: https://i.imgur.com/0jHn8yd.jpg
3. 修改`solar-system.js`文件中的图片路径，例如将`https://i.imgur.com/yQb4G2Q.jpg`改为`textures/yQb4G2Q.jpg` / Modify the image paths in the `solar-system.js` file, for example, change `https://i.imgur.com/yQb4G2Q.jpg` to `textures/yQb4G2Q.jpg`

### 方法2：从Solar System Scope下载纹理 / Method 2: Download Textures from Solar System Scope
1. 访问Solar System Scope纹理页面：https://www.solarsystemscope.com/textures/ / Visit Solar System Scope texture page: https://www.solarsystemscope.com/textures/
2. 该网站提供2K、4K、8K分辨率的太阳系星球贴图资源 / This website provides 2K, 4K, 8K resolution texture resources for solar system planets
3. 如果无法直接下载，可以使用以下替代链接： / If direct download is not possible, you can use the following alternative links:
   - 天翼网盘打包下载：https://cloud.189.cn/web/share?code=lbv1（访问码：lbv1） / 189 Cloud packaged download: https://cloud.189.cn/web/share?code=lbv1 (access code: lbv1)
   - 注意：需要注册天翼网盘账号才能下载 / Note: You need to register an 189 Cloud account to download

### 方法3：手动下载纹理 / Method 3: Manually Download Textures
如果自动下载脚本无法正常工作，您可以手动下载纹理图片： / If the automatic download script doesn't work properly, you can manually download the texture images:
1. 访问以下Imgur链接下载对应的纹理图片： / Visit the following Imgur links to download the corresponding texture images:
   - 太阳: https://i.imgur.com/yQb4G2Q.jpg / Sun: https://i.imgur.com/yQb4G2Q.jpg
   - 水星: https://i.imgur.com/5C6X7A0.jpg / Mercury: https://i.imgur.com/5C6X7A0.jpg
   - 金星: https://i.imgur.com/pQaO8Lm.jpg / Venus: https://i.imgur.com/pQaO8Lm.jpg
   - 地球: https://i.imgur.com/3M0zRMR.jpg / Earth: https://i.imgur.com/3M0zRMR.jpg
   - 火星: https://i.imgur.com/3xX8g3T.jpg / Mars: https://i.imgur.com/3xX8g3T.jpg
   - 木星: https://i.imgur.com/jjVHbUe.jpg / Jupiter: https://i.imgur.com/jjVHbUe.jpg
   - 土星: https://i.imgur.com/KGv27UQ.jpg / Saturn: https://i.imgur.com/KGv27UQ.jpg
   - 天王星: https://i.imgur.com/5FgZbO6.jpg / Uranus: https://i.imgur.com/5FgZbO6.jpg
   - 海王星: https://i.imgur.com/0jHn8yd.jpg / Neptune: https://i.imgur.com/0jHn8yd.jpg
2. 将下载的图片保存到项目的`images`文件夹中 / Save the downloaded images to the `images` folder of the project
3. 确保文件名与上述链接中的文件名一致 / Make sure the file names match those in the links above

### 方法4：使用离线模式 / Method 4: Use Offline Mode
如果您不需要查看真实纹理，可以直接使用彩色行星模式，这是默认启用的。 / If you don't need to view real textures, you can directly use the color planet mode, which is enabled by default.

## 技术栈 / Technology Stack
- HTML5
- CSS3
- JavaScript
- Three.js

## 界面控制 / Interface Controls
- 拖动鼠标：旋转视角 / Drag mouse: Rotate view
- 滚轮：缩放视角 / Scroll wheel: Zoom view
- 显示/隐藏标签按钮：切换行星标签显示 / Show/Hide Labels button: Toggle planet labels display
- 显示/隐藏背景按钮：切换星空背景显示 / Show/Hide Background button: Toggle starry sky background display
- 速度控制滑块：调整行星运行速度 / Speed Control slider: Adjust planet movement speed
- 语言切换按钮：在中英文界面间切换 / Language toggle button: Switch between Chinese and English interface

## 项目结构 / Project Structure
```
├── README.md              # 项目说明文档 / Project documentation
├── index.html             # 主HTML文件 / Main HTML file
├── solar-system.js        # 太阳系模拟主脚本 / Main solar system simulation script
├── language.js            # 语言切换功能脚本 / Language switching functionality script
├── styles.css             # 样式表 / Stylesheet
├── images/                # 图像文件夹 / Images folder
│   └── [纹理图片]         # Texture images
└── js/                    # JavaScript库文件夹 / JavaScript libraries folder
    ├── three.min.js       # Three.js库 / Three.js library
    ├── OrbitControls.js   # 轨道控制器 / Orbit controls
    ├── CSS2DRenderer.js   # 2D标签渲染器 / 2D label renderer
    └── language.js        # 语言管理模块 / Language management module
```
