// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 用于存储当前选中的星球
    let selectedPlanet = null;
    // 控制动画暂停/播放
    let isPaused = false;
    // 存储相机原始位置
    let originalCameraPosition = new THREE.Vector3();
    // 存储控制器原始目标
    let originalControlsTarget = new THREE.Vector3();
    // 信息面板DOM元素
    let infoPanel = null;
    // 连接线DOM元素
    let connectionLine = null;
    // 打字机效果相关变量
    let typingInterval = null;
    let typingIndex = 0;

    // 初始化场景
    const scene = new THREE.Scene();

    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 100, 500);

    // 创建渲染器
    const container = document.getElementById('solar-system-container');
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 创建CSS2D渲染器用于显示星球名称标签
    const labelRenderer = new THREE.CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.pointerEvents = 'none'; // 让标签不阻挡交互
    container.appendChild(labelRenderer.domElement);

    // 添加轨道控制器，允许用户拖动和旋转场景
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // 星空背景变量
    let starField;

    // 创建星空背景
    function createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 10000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 2000;
            positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            positions[i3 + 2] = (Math.random() - 0.5) * 2000;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.5,
            transparent: true,
            opacity: 0.8
        });

        starField = new THREE.Points(starGeometry, starMaterial);
        scene.add(starField);
    }

    createStarfield();

    // 控制标签显示/隐藏
    let labelsVisible = true;
    const planetLabels = []; // 存储所有星球标签

    // 控制背景显示/隐藏
    let backgroundVisible = true;

    // 时间速度因子 - 控制星球运动速度
    let timeSpeedFactor = 1.0;

    // 确保DOM加载完成后再绑定事件
    function initControls() {
        // 标签控制
        const toggleLabelsBtn = document.getElementById('toggleLabels');
        if (toggleLabelsBtn) {
            toggleLabelsBtn.addEventListener('click', function() {
                labelsVisible = !labelsVisible;
                // 更新所有标签的可见性
                updateLabelsVisibility();
            });
        }

        // 更新标签可见性函数
        function updateLabelsVisibility() {
            planetLabels.forEach(label => {
                label.visible = labelsVisible;
            });
        }

        // 背景控制
        const toggleBackgroundBtn = document.getElementById('toggleBackground');
            if (toggleBackgroundBtn) {
                toggleBackgroundBtn.addEventListener('click', function() {
                    backgroundVisible = !backgroundVisible;
                    if (starField) {
                        starField.visible = backgroundVisible;
                    }
                });
            }

        // 速度控制
        const speedControl = document.getElementById('speedControl');
        const speedValue = document.getElementById('speedValue');
        if (speedControl && speedValue) {
            // 更新显示的速度值
            speedValue.textContent = `${timeSpeedFactor.toFixed(1)}x`;

            // 绑定滑动事件
            speedControl.addEventListener('input', function() {
                timeSpeedFactor = parseFloat(this.value);
                speedValue.textContent = `${timeSpeedFactor.toFixed(1)}x`;
            });
        }
    }

    // 创建信息面板
    function createInfoPanel() {
        if (infoPanel) return; // 如果已存在则不再创建

        infoPanel = document.createElement('div');
        infoPanel.className = 'planet-info-panel';
        infoPanel.style.position = 'absolute';
        infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        infoPanel.style.color = 'white';
        infoPanel.style.padding = '15px';
        infoPanel.style.borderRadius = '10px';
        infoPanel.style.maxWidth = '300px';
        infoPanel.style.display = 'none';
        infoPanel.style.zIndex = '100';
        infoPanel.style.pointerEvents = 'none';
        infoPanel.style.fontFamily = '微软雅黑, Microsoft YaHei, sans-serif';
        container.appendChild(infoPanel);
    }

    // 创建连接线
    function createConnectionLine() {
        if (connectionLine) return; // 如果已存在则不再创建

        connectionLine = document.createElement('div');
        connectionLine.className = 'connection-line';
        connectionLine.style.position = 'absolute';
        connectionLine.style.width = '200px';
        connectionLine.style.height = '2px';
        connectionLine.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        connectionLine.style.transformOrigin = '0 0';
        connectionLine.style.display = 'none';
        connectionLine.style.zIndex = '99';
        connectionLine.style.pointerEvents = 'none';
        container.appendChild(connectionLine);
    }

    // 打字机效果函数
    function typeText(text, element) {
        clearInterval(typingInterval);
        typingIndex = 0;
        element.innerHTML = '';

        typingInterval = setInterval(() => {
            if (typingIndex < text.length) {
                element.innerHTML += text.charAt(typingIndex);
                typingIndex++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
    }

    // 初始化控件
    initControls();

    // 太阳系数据
    const solarSystemData = {
        sun: {
            radius: 50,
            color: 0xffEE00,
            texture: 'images/sun.jpg',
            rotationSpeed: 0.002,
            flareIntensity: 1.5,
            diameter: 1392700, // 直径(km)
            distanceFromEarth: 149600000, // 距离地球(km)
            name: '太阳'
        },
        mercury: {
            radius: 4,
            color: 0xaaaaaa,
            texture: 'images/mercury.jpg',
            distance: 80,
            orbitSpeed: 1.6,  // 0.04 * 40
            rotationSpeed: 0.004,
            diameter: 4879, // 直径(km)
            distanceFromSun: 57900000, // 距离太阳(km)
            distanceFromEarth: 91700000, // 距离地球(km)
            name: '水星'
        },
        venus: {
            radius: 9,
            color: 0xe3c7a0,
            texture: 'images/venus.jpg',
            distance: 120,
            orbitSpeed: 0.6,  // 0.015 * 40
            rotationSpeed: 0.002,
            diameter: 12104, // 直径(km)
            distanceFromSun: 108200000, // 距离太阳(km)
            distanceFromEarth: 41400000, // 距离地球(km)
            name: '金星'
        },
        earth: {
            radius: 10,
            color: 0x2233ff,
            texture: 'images/earth.jpg',
            distance: 160,
            orbitSpeed: 0.4,  // 0.01 * 40
            rotationSpeed: 0.01,
            diameter: 12756, // 直径(km)
            distanceFromSun: 149600000, // 距离太阳(km)
            distanceFromEarth: 0, // 距离地球(km)
            name: '地球'
        },
        mars: {
            radius: 5,
            color: 0xff3300,
            texture: 'images/mars.jpg',
            distance: 200,
            orbitSpeed: 0.212,  // 0.0053 * 40
            rotationSpeed: 0.009,
            diameter: 6792, // 直径(km)
            distanceFromSun: 227900000, // 距离太阳(km)
            distanceFromEarth: 78300000, // 距离地球(km)
            name: '火星'
        },
        jupiter: {
            radius: 30,
            color: 0xffaa88,
            texture: 'images/jupiter.jpg',
            distance: 280,
            orbitSpeed: 0.0336,  // 0.00084 * 40
            rotationSpeed: 0.04,
            diameter: 142984, // 直径(km)
            distanceFromSun: 778500000, // 距离太阳(km)
            distanceFromEarth: 628700000, // 距离地球(km)
            name: '木星'
        },
        saturn: {
            radius: 25,
            color: 0xffcc99,
            texture: 'images/saturn.jpg',
            distance: 360,
            orbitSpeed: 0.0132,  // 0.00033 * 40
            rotationSpeed: 0.038,
            diameter: 120536, // 直径(km)
            distanceFromSun: 1433500000, // 距离太阳(km)
            distanceFromEarth: 1283900000, // 距离地球(km)
            name: '土星'
        },
        uranus: {
            radius: 18,
            color: 0x99ccff,
            texture: 'images/uranus.jpg',
            distance: 420,
            orbitSpeed: 0.0048,  // 0.00012 * 40
            rotationSpeed: 0.03,
            diameter: 51118, // 直径(km)
            distanceFromSun: 2872500000, // 距离太阳(km)
            distanceFromEarth: 2723000000, // 距离地球(km)
            name: '天王星'
        },
        neptune: {
            radius: 17,
            color: 0x3366ff,
            texture: 'images/neptune.jpg',
            distance: 480,
            orbitSpeed: 0.0024,  // 0.00006 * 40
            rotationSpeed: 0.032,
            diameter: 49528, // 直径(km)
            distanceFromSun: 4495100000, // 距离太阳(km)
            distanceFromEarth: 4345500000, // 距离地球(km)
            name: '海王星'
        }
    };

    // 创建天体函数
    function createCelestialBody(data, name, isSun = false) {
        // 增加分段数使星球更平滑
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        
        // 改进材质设置
        const material = new THREE.MeshStandardMaterial({
            color: data.color,
            shininess: isSun ? 100 : 50,
            metalness: isSun ? 0.2 : 0.1,
            roughness: isSun ? 0.1 : 0.6,
            transparent: !isSun, // 非太阳可以有透明度
            opacity: 1.0
        });

        // 尝试加载纹理，如果成功则应用
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(data.texture, function(texture) {
            // 优化纹理设置
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            material.map = texture;
            material.needsUpdate = true;
        }, undefined, function(error) {
            // 纹理加载失败时的备选方案
            console.warn(`无法加载${name}的纹理:`, error);
            // 为不同行星提供更丰富的备选效果
            if (name === '地球') {
                // 为地球添加蓝色大气层效果
                material.color = new THREE.Color(0x2233ff);
                material.opacity = 0.9;
            } else if (name === '木星') {
                // 为木星添加条纹效果
                material.color = new THREE.Color(0xffaa88);
                material.emissive = new THREE.Color(0x222200);
            } else if (name === '天王星' || name === '海王星') {
                // 为冰巨星添加冰蓝色效果
                material.color = name === '天王星' ? new THREE.Color(0x99ccff) : new THREE.Color(0x3366ff);
                material.emissive = new THREE.Color(0x002244);
            }
            material.needsUpdate = true;
        });

        if (isSun) {
            // 太阳添加自发光效果
            material.emissive = new THREE.Color(0xff0000); // 红色自发光
            material.emissiveIntensity = 2.0; // 增加亮度
            material.color = new THREE.Color(0xff0000); // 红色
            material.transparent = false; // 太阳不透明
        }

        const body = new THREE.Mesh(geometry, material);

        if (!isSun) {
            // 创建更美观的轨道
            createOrbit(data.distance);

            // 设置行星轨道位置
            body.position.x = data.distance;

            // 为特定行星添加特殊效果
            if (name === '地球') {
                // 为地球添加大气层效果
                createAtmosphere(body, data.radius);
            } else if (name === '木星' || name === '天王星' || name === '海王星') {
                // 为气态巨行星添加光环效果
                createGasGiantRings(body, data.radius);
            }
        }

        return body;
    }

    // 创建更美观的轨道
    function createOrbit(distance) {
        const orbitGeometry = new THREE.RingGeometry(distance, distance + 1.5, 256); // 增加分段数使轨道更平滑
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x334455, // 深蓝色调轨道
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
    }

    // 为地球创建大气层效果
    function createAtmosphere(body, radius) {
        const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.1, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x2299ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        body.add(atmosphere);
    }

    // 为气态巨行星创建光环效果
    function createGasGiantRings(body, radius) {
        const ringGeometry = new THREE.RingGeometry(radius * 1.3, radius * 1.6, 128);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.5; // 稍微倾斜
        body.add(ring);
    }

    // 创建太阳系
    const solarSystem = {};



    // 创建太阳
    solarSystem.sun = createCelestialBody(solarSystemData.sun, '太阳', true);
    scene.add(solarSystem.sun);
    
    // 为太阳添加标签
    createPlanetLabel('太阳', solarSystem.sun);

    // 添加太阳耀斑效果 - 修改为明亮的红色闪烁耀斑
    function createSunFlares() {
        const flareGeometry = new THREE.BufferGeometry();
        const flareCount = 12;
        const positions = new Float32Array(flareCount * 3);
        const sizes = new Float32Array(flareCount);
        const colors = new Float32Array(flareCount * 3);
        const opacities = new Float32Array(flareCount);
        const sunData = solarSystemData.sun;

        for (let i = 0; i < flareCount; i++) {
            const i3 = i * 3;
            // 随机角度和距离
            const angle = Math.random() * Math.PI * 2;
            const distance = sunData.radius * (0.15 + Math.random() * 0.4);
            positions[i3] = Math.cos(angle) * distance;
            positions[i3 + 1] = (Math.random() - 0.5) * sunData.radius * 0.3;
            positions[i3 + 2] = Math.sin(angle) * distance;

            sizes[i] = sunData.radius * (0.15 + Math.random() * 0.3);

            // 耀斑颜色: 更明亮的红色系
            const color = new THREE.Color(
                1.0,
                0.1 + Math.random() * 0.2,
                0.0 + Math.random() * 0.1
            );
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;

            // 初始透明度
            opacities[i] = 0.5 + Math.random() * 0.5;
        }

        flareGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        flareGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        flareGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        flareGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

        const flareMaterial = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: {
                    value: new THREE.TextureLoader().load('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==')
                }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                varying vec3 vColor;
                void main() {
                    vOpacity = opacity;
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_PointSize = size * ( 300.0 / -mvPosition.z );
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying float vOpacity;
                varying vec3 vColor;
                void main() {
                    gl_FragColor = vec4( vColor, vOpacity );
                    gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
                }
            `,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });

        const flares = new THREE.Points(flareGeometry, flareMaterial);
        solarSystem.sun.add(flares);

        // 闪烁动画
        let opacityFactors = new Array(flareCount).fill(0).map(() => Math.random() * 0.03 + 0.01);
        let opacityDirections = new Array(flareCount).fill(1);

        function animateFlares() {
            requestAnimationFrame(animateFlares);
            flares.rotation.y += 0.005;

            // 更新透明度实现闪烁效果
            const opacityAttribute = flareGeometry.getAttribute('opacity');
            const opacities = opacityAttribute.array;

            for (let i = 0; i < flareCount; i++) {
                opacities[i] += opacityFactors[i] * opacityDirections[i];

                if (opacities[i] > 1.0) {
                    opacities[i] = 1.0;
                    opacityDirections[i] = -1;
                } else if (opacities[i] < 0.3) {
                    opacities[i] = 0.3;
                    opacityDirections[i] = 1;
                }
            }

            opacityAttribute.needsUpdate = true;
        }
        animateFlares();
    }
    createSunFlares();

    // 行星名称映射
    const planetNameMap = {
        'mercury': '水星',
        'venus': '金星',
        'earth': '地球',
        'mars': '火星',
        'jupiter': '木星',
        'saturn': '土星',
        'uranus': '天王星',
        'neptune': '海王星'
    };

    // 创建土星环
    function createSaturnRings() {
        const saturnData = solarSystemData.saturn;
        const totalRingWidth = saturnData.radius * 1.1;
        const ringOffset = saturnData.radius * 1.4;
        const numRings = 5; // 至少5条环

        // 从外到内创建多个环
        for (let i = 0; i < numRings; i++) {
            // 计算当前环的内半径和外半径
            // 外层环较宽，内层环较窄，宽度比之前细一半
            const ringWidth = totalRingWidth * (numRings - i) / numRings / 4;
            const innerRadius = ringOffset + i * (totalRingWidth / numRings);
            const outerRadius = innerRadius + ringWidth;

            // 创建环几何体
            const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 128);

            // 创建材质 - 纯白色，适当透明度
            const ringMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });

            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.x = Math.PI / 2.2; // 保持适当倾斜角度
            solarSystem.saturn.add(ring);
        }
    }

    // 创建月球
    function createMoon() {
        const earthData = solarSystemData.earth;
        const moonData = {
            radius: earthData.radius * 0.27,
            color: 0xffffff,
            texture: 'images/mercury.jpg', // 使用水星纹理作为月球纹理
            distance: earthData.radius * 2.5,
            orbitSpeed: 0.05,
            rotationSpeed: 0.005
        };

        const geometry = new THREE.SphereGeometry(moonData.radius, 16, 16);
        const material = new THREE.MeshPhongMaterial({
            color: moonData.color,
            shininess: 30
        });

        // 加载纹理
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(moonData.texture, function(texture) {
            material.map = texture;
            material.needsUpdate = true;
        });

        const moon = new THREE.Mesh(geometry, material);
        moon.position.x = moonData.distance;

        // 添加月球到地球
        solarSystem.earth.add(moon);

        // 为月球添加标签
        createPlanetLabel('月球', moon);

        // 存储月球数据以便动画更新
        solarSystem.moon = {
            mesh: moon,
            data: moonData
        };


    }

    // 创建行星
    for (const planetName in solarSystemData) {
        if (planetName !== 'sun') {
            solarSystem[planetName] = createCelestialBody(solarSystemData[planetName], planetNameMap[planetName]);
            scene.add(solarSystem[planetName]);
            
            // 为行星添加标签
            createPlanetLabel(planetNameMap[planetName], solarSystem[planetName]);
        }
    }

    // 为土星添加光环
    createSaturnRings();

    // 为地球添加月球
    createMoon();



    // 双击事件处理函数
    function handleDoubleClick(event) {
        console.log('双击事件被触发，event对象:', event);
        event.preventDefault();

        // 创建射线投射器
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // 计算鼠标位置归一化坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        console.log('计算的鼠标归一化坐标:', mouse);

        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);

        // 检测与星球的碰撞
        const planetObjects = [];
        for (const key in solarSystem) {
            if (solarSystem.hasOwnProperty(key) && key !== 'moon') {
                planetObjects.push(solarSystem[key]);
            }
        }
        console.log('准备检测碰撞的星球数量:', planetObjects.length);

        const intersects = raycaster.intersectObjects(planetObjects);
        console.log('碰撞检测结果数量:', intersects.length);

        if (intersects.length > 0) {
            console.log('检测到与星球碰撞:', intersects[0].object.name);
            const clickedPlanet = intersects[0].object;
            const planetName = clickedPlanet.parent ? clickedPlanet.parent.name : clickedPlanet.name;
            let planetData = null;

            // 查找对应的星球数据
            for (const key in solarSystemData) {
                if (solarSystemData[key].name === planetNameMap[planetName] || solarSystemData[key].name === planetName) {
                    console.log('找到星球数据:', solarSystemData[key]);
                    planetData = solarSystemData[key];
                    break;
                }
            }

            // 如果没有找到，尝试直接使用对象名称
            if (!planetData) {
                console.log('尝试直接使用对象名称查找数据:', planetName);
                for (const key in solarSystemData) {
                    if (key === planetName || solarSystemData[key].name === planetName) {
                        console.log('通过对象名称找到数据:', solarSystemData[key]);
                        planetData = solarSystemData[key];
                        break;
                    }
                }
            }

            // 如果仍然没有找到，使用默认数据进行测试
            if (!planetData) {
                console.log('未找到星球数据，使用默认地球数据进行测试');
                planetData = {
                    name: '地球',
                    diameter: 12742,
                    distanceFromSun: 149600000,
                    distanceFromEarth: 0
                };
            }

            // 如果已经选中了这个星球，则恢复原状态
            if (selectedPlanet === clickedPlanet) {
                console.log('已经选中了这个星球，恢复原状态');
                restoreView();
            } else {
                // 否则选中这个星球
                console.log('选中星球:', clickedPlanet.name, planetData);
                // 直接调用selectPlanet函数，确保信息面板显示
                selectPlanet(clickedPlanet, planetData);
            }
        } else if (selectedPlanet) {
            // 如果点击了空白区域且有选中的星球，则恢复原状态
            console.log('点击了空白区域，恢复原状态');
            restoreView();
        }
    }

    // 选中星球函数
    window.selectPlanet = function(planet, planetData) {
    console.log('selectPlanet函数被调用');
    console.log('planet:', planet);
    console.log('planetData:', planetData);
        // 存储当前相机和控制器状态
        originalCameraPosition.copy(camera.position);
        originalControlsTarget.copy(controls.target);

        // 设置选中的星球
        selectedPlanet = planet;

        // 暂停动画
        isPaused = true;

        // 简化版信息面板显示逻辑
    console.log('简化版信息面板显示逻辑开始');
    
    // 直接创建信息面板（如果不存在）
    if (!infoPanel) {
        console.log('创建简化版信息面板');
        infoPanel = document.createElement('div');
        infoPanel.className = 'planet-info-panel';
        infoPanel.style.display = 'block';
        infoPanel.style.position = 'fixed';
        infoPanel.style.zIndex = '1000';
        infoPanel.style.left = '50%';
        infoPanel.style.top = '50%';
        infoPanel.style.transform = 'translate(-50%, -50%)';
        infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        infoPanel.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        infoPanel.style.borderRadius = '10px';
        infoPanel.style.padding = '15px';
        infoPanel.style.color = '#fff';
        infoPanel.style.fontSize = '16px';
        infoPanel.style.fontFamily = '微软雅黑, Microsoft YaHei, sans-serif';
        infoPanel.style.textAlign = 'center';
        infoPanel.style.minWidth = '250px';
        document.body.appendChild(infoPanel);
    } else {
        infoPanel.style.display = 'block';
    }
    
    // 根据星球名称设置不同的背景颜色，提供明显的视觉反馈
    if (planetData && planetData.name) {
        console.log('根据星球名称设置背景颜色:', planetData.name);
        
        // 为不同星球设置不同的边框颜色
        let borderColor = 'rgba(255, 255, 255, 0.2)';
        
        switch (planetData.name) {
            case '太阳':
                borderColor = 'rgba(255, 255, 0, 0.8)';
                break;
            case '水星':
                borderColor = 'rgba(170, 170, 170, 0.8)';
                break;
            case '金星':
                borderColor = 'rgba(227, 199, 160, 0.8)';
                break;
            case '地球':
                borderColor = 'rgba(34, 51, 255, 0.8)';
                break;
            case '火星':
                borderColor = 'rgba(255, 51, 0, 0.8)';
                break;
            case '木星':
                borderColor = 'rgba(255, 170, 136, 0.8)';
                break;
            case '土星':
                borderColor = 'rgba(255, 204, 153, 0.8)';
                break;
            case '天王星':
                borderColor = 'rgba(153, 204, 255, 0.8)';
                break;
            case '海王星':
                borderColor = 'rgba(51, 102, 255, 0.8)';
                break;
            default:
                borderColor = 'rgba(255, 255, 255, 0.2)';
        }
        
        infoPanel.style.border = `3px solid ${borderColor}`;
        
        // 直接设置信息面板内容，增加星球名称的字号和粗细
        const formattedDiameter = formatNumber(planetData.diameter);
        const formattedDistanceFromSun = formatNumber(planetData.distanceFromSun);
        const formattedDistanceFromEarth = formatNumber(planetData.distanceFromEarth);
        
        const infoText = `<div style="font-size: 22px; font-weight: bold; margin-bottom: 10px; color: ${borderColor}">${planetData.name}</div>
<div style="margin: 5px 0;">直径: <strong>${formattedDiameter} km</strong></div>
<div style="margin: 5px 0;">距离太阳: <strong>${formattedDistanceFromSun} km</strong></div>
<div style="margin: 5px 0;">距离地球: <strong>${formattedDistanceFromEarth} km</strong></div>`;
        
        // 直接设置HTML内容
        infoPanel.innerHTML = infoText;
    } else {
        console.log('planetData为空，无法设置信息面板内容');
        infoPanel.innerHTML = '<div style="font-size: 18px; font-weight: bold; color: #ff4444;">未找到星球数据</div>';
        infoPanel.style.border = '3px solid rgba(255, 68, 68, 0.8)';
    }
    
    console.log('简化版信息面板显示逻辑结束');

        // 平滑移动相机到星球
        const targetPosition = new THREE.Vector3();
        targetPosition.copy(planet.position);
        targetPosition.normalize().multiplyScalar(planetData.radius * 5);

        // 动画移动相机
        gsap.to(camera.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                controls.target.copy(planet.position);
                updateInfoPanelPosition(planet);
            }
        });
    }

    // 创建信息面板函数
    function createInfoPanel() {
        if (infoPanel) return;

        infoPanel = document.createElement('div');
        infoPanel.className = 'planet-info-panel';
        infoPanel.style.display = 'none';
        infoPanel.style.position = 'fixed';
        infoPanel.style.zIndex = '1000'; // 确保显示在最前面
        document.body.appendChild(infoPanel);
    }

    // 创建连接线函数
    function createConnectionLine() {
        if (connectionLine) return;

        connectionLine = document.createElement('div');
        connectionLine.className = 'connection-line';
        connectionLine.style.display = 'none';
        connectionLine.style.position = 'fixed';
        connectionLine.style.zIndex = '999'; // 确保显示在星球上方但在信息面板下方
        document.body.appendChild(connectionLine);
    }

    // 打字机效果函数
    function typeText(text, element) {
        let index = 0;
        element.innerHTML = '';

        // 清除之前的打字机效果
        clearInterval(typingInterval);

        // 开始新的打字机效果
        typingInterval = setInterval(function() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    }

    // 恢复视图函数
    function restoreView() {
        // 隐藏信息面板和连接线
        if (infoPanel) infoPanel.style.display = 'none';
        if (connectionLine) connectionLine.style.display = 'none';

        // 清除打字机效果
        clearInterval(typingInterval);

        // 平滑移动相机回到原位
        gsap.to(camera.position, {
            x: originalCameraPosition.x,
            y: originalCameraPosition.y,
            z: originalCameraPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: function() {
                controls.target.copy(originalControlsTarget);
            },
            onComplete: function() {
                // 恢复动画
                isPaused = false;
                selectedPlanet = null;
            }
        });
    }

    // 更新信息面板内容
    function updateInfoPanel(planetData) {
    console.log('更新信息面板内容:', planetData);
        if (!infoPanel || !planetData) return;

        // 格式化距离和直径
        const formattedDiameter = formatNumber(planetData.diameter);
        const formattedDistanceFromSun = formatNumber(planetData.distanceFromSun);
        const formattedDistanceFromEarth = formatNumber(planetData.distanceFromEarth);

        // 创建信息文本
        const infoText = `${planetData.name}
直径: ${formattedDiameter} km
距离太阳: ${formattedDistanceFromSun} km
距离地球: ${formattedDistanceFromEarth} km`;

        // 使用打字机效果显示文本
    console.log('使用打字机效果显示文本:', infoText);
        typeText(infoText, infoPanel);
    }

    // 更新信息面板位置
    function updateInfoPanelPosition(planet) {
        if (!infoPanel || !connectionLine || !planet) return;

        // 将星球位置转换为屏幕坐标
        const planetScreenPosition = new THREE.Vector3();
        planet.getWorldPosition(planetScreenPosition);
        planetScreenPosition.project(camera);

        // 计算屏幕上的坐标
        const x = (planetScreenPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(planetScreenPosition.y * 0.5) + 0.5) * window.innerHeight;

        // 设置连接线位置和角度（左斜向上80度）
        const lineLength = 150;
        const angle = 80 * Math.PI / 180; // 转换为弧度
        const lineEndX = x + lineLength * Math.cos(angle);
        const lineEndY = y - lineLength * Math.sin(angle);

        connectionLine.style.left = `${x}px`;
            connectionLine.style.top = `${y}px`;
            connectionLine.style.width = `${lineLength}px`;
            connectionLine.style.transform = `rotate(-${80}deg)`;

            // 设置信息面板位置
            infoPanel.style.left = `${lineEndX + 10}px`;
            infoPanel.style.top = `${lineEndY - 20}px`;
    }

    // 数字格式化函数
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'K';
        }
        return num.toString();
    }

    // 添加双击事件监听（同时添加到document和renderer.domElement）
    console.log('尝试添加双击事件监听器到renderer.domElement:', renderer.domElement);
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('dblclick', handleDoubleClick);
        console.log('双击事件监听器添加到renderer.domElement成功！');
    } else {
        console.log('无法添加双击事件监听器到renderer.domElement：renderer或renderer.domElement不存在');
    }
    
    // 添加全局双击事件监听 - 修复版本
    document.addEventListener('dblclick', function(event) {
        console.log('全局双击事件被触发');
        
        // 创建射线投射器
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        
        // 计算鼠标位置归一化坐标
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // 更新射线投射器
        raycaster.setFromCamera(mouse, camera);
        
        // 检测与星球的碰撞
        const planetObjects = [];
        for (const key in solarSystem) {
            if (solarSystem.hasOwnProperty(key) && key !== 'moon') {
                planetObjects.push(solarSystem[key]);
            }
        }
        
        const intersects = raycaster.intersectObjects(planetObjects);
        
        if (intersects.length > 0) {
            console.log('检测到与星球碰撞:', intersects[0].object);
            const clickedPlanet = intersects[0].object;
            
            // 查找对应的星球数据 - 改进版：直接通过对象引用查找
            let planetData = null;
            let planetKey = null;
            
            // 遍历solarSystem对象，找到与clickedPlanet对应的键
            for (const key in solarSystem) {
                if (solarSystem.hasOwnProperty(key) && solarSystem[key] === clickedPlanet) {
                    planetKey = key;
                    break;
                }
            }
            
            // 如果找到了键，使用对应的solarSystemData
            if (planetKey && solarSystemData[planetKey]) {
                planetData = solarSystemData[planetKey];
                console.log('找到星球数据:', planetData.name);
            } else {
                // 如果没有找到，尝试通过其他方式识别
                console.log('未直接找到星球数据，尝试其他方式识别');
                
                // 检查点击的是否是太阳
                if (clickedPlanet === solarSystem.sun) {
                    planetData = solarSystemData.sun;
                    console.log('识别为太阳');
                } else {
                    // 遍历所有星球数据，查看是否有匹配的对象
                    for (const key in solarSystemData) {
                        if (key !== 'sun' && solarSystem[key] === clickedPlanet) {
                            planetData = solarSystemData[key];
                            console.log('通过遍历找到星球数据:', planetData.name);
                            break;
                        }
                    }
                }
            }
            
            // 如果仍然没有找到，使用默认地球数据（作为最后的备选）
            if (!planetData) {
                console.log('仍然未找到星球数据，使用默认地球数据');
                planetData = {
                    name: '地球',
                    diameter: 12742,
                    distanceFromSun: 149600000,
                    distanceFromEarth: 0
                };
            }
            
            // 直接调用selectPlanet函数显示信息面板
            selectPlanet(clickedPlanet, planetData);
        }
    });
    
    // 添加单击事件监听作为测试
    if (renderer && renderer.domElement) {
        renderer.domElement.addEventListener('click', function(event) {
            console.log('单击事件被触发，检查renderer.domElement是否可交互');
        });
    }

    // 创建3D文字标签
    function createPlanetLabel(planetName, planet) {
        // 计算字体大小，使其与星球大小成正比
        const baseFontSize = 14; // 基础字体大小
        const planetRadius = planet.geometry.parameters.radius;
        const fontSize = baseFontSize * (planetRadius / 10); // 按比例调整字体大小
        
        // 创建包含中文名称的HTML元素
        const labelDiv = document.createElement('div');
        labelDiv.className = 'label';
        labelDiv.textContent = planetName;
        labelDiv.style.color = 'white';
        labelDiv.style.fontSize = `${fontSize}px`;
        labelDiv.style.fontFamily = '微软雅黑, Microsoft YaHei, sans-serif'; // 使用微软雅黑字体
        labelDiv.style.fontWeight = 'normal';
        labelDiv.style.textShadow = '1px 1px 2px black';
        labelDiv.style.pointerEvents = 'none'; // 确保标签不会干扰鼠标事件
        
        // 创建CSS2D对象
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(0, planet.position.y + planet.geometry.parameters.radius + 10, 0);
        planet.add(label);
        
        // 将标签添加到数组中以便控制可见性
        planetLabels.push(label);
        
        return label;
    }

    // 获取对比色函数
    function getContrastColor(color) {
        // 简单的颜色对比算法
        const hex = color.toString(16).padStart(6, '0');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }



    // 添加光源
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffff00, 2, 10000);
    pointLight.position.set(0, 0, 0); // 将光源放在太阳位置
    scene.add(pointLight);

    // 动画循环
    function animate() {
        requestAnimationFrame(animate);

        // 只有在未暂停时才更新动画
        if (!isPaused) {
            // 旋转太阳
            solarSystem.sun.rotation.y += solarSystemData.sun.rotationSpeed * timeSpeedFactor;

            // 旋转行星并沿轨道运行
            for (const planetName in solarSystem) {
                if (planetName !== 'sun' && planetName !== 'moon') {
                    const planet = solarSystem[planetName];
                    const data = solarSystemData[planetName];

                    // 行星自转
                    planet.rotation.y += data.rotationSpeed * timeSpeedFactor;

                    // 行星公转
                    const angle = Date.now() * 0.0001 * data.orbitSpeed * timeSpeedFactor;
                    planet.position.x = data.distance * Math.cos(angle);
                    planet.position.z = data.distance * Math.sin(angle);
                }
            }

            // 月球运动
            if (solarSystem.moon) {
                const moon = solarSystem.moon.mesh;
                const data = solarSystem.moon.data;

                // 月球自转
                moon.rotation.y += data.rotationSpeed * timeSpeedFactor;

                // 月球公转
                const angle = Date.now() * 0.0001 * data.orbitSpeed * timeSpeedFactor;
                moon.position.x = data.distance * Math.cos(angle);
                moon.position.z = data.distance * Math.sin(angle);
            }
        } else if (selectedPlanet) {
            // 如果暂停但有选中的星球，更新信息面板位置
            updateInfoPanelPosition(selectedPlanet);
        }

        // 更新控制器
        controls.update();

        // 渲染场景
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }

    // 开始动画
    animate();

    // 窗口大小调整事件
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
    });
});