// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 菜单切换
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }

    // 点击导航链接关闭菜单（移动端）
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900 && mainNav) {
                mainNav.classList.remove('active');
            }
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 获取悬浮按钮与折叠切换控件（若 HTML 未包含，将回退为原选择）
    // 与右下角浮动操作相关的 DOM 查询与交互已移除（避免对不存在元素的引用）

    // 背景显示开关（由 HTML data 属性控制，默认：粒子 true，背景图 false）
    const bgLayer = document.querySelector('.bg-layer');
    const bgImageDiv = document.querySelector('.bg-image');
    const enableParticles = bgLayer ? (bgLayer.dataset.enableParticles === 'true') : true;
    const enableBgImage = bgLayer ? (bgLayer.dataset.enableBg === 'true') : false;

    if (bgImageDiv) {
        const isMobile = window.innerWidth <= 768;
        const bgImage = isMobile ? bgImageDiv.dataset.bgPhone : bgImageDiv.dataset.bgPc;
        bgImageDiv.style.backgroundImage = `url('${bgImage}')`;
    }

    const canvas = document.getElementById('particleCanvas');
    const bgImageLayer = document.getElementById('bgImageLayer');

    // 按配置显示/隐藏背景图
    if (bgImageLayer) {
        bgImageLayer.style.display = enableBgImage ? 'block' : 'none';
    }

    // 简单粒子系统（安全检测节点，若 canvas 不存在则跳过）
    let particles = [];
    let ctx = null;
    let animationId = null;

    function initCanvasSize() {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(rect.width * ratio));
        canvas.height = Math.max(1, Math.floor(rect.height * ratio));
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function createParticles(count = 60) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                r: 0.6 + Math.random() * 1.8,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                alpha: 0.3 + Math.random() * 0.7,
                // 新增颜色属性：色相、饱和度、亮度、色相速度（缓慢变化）
                h: Math.floor(Math.random() * 360),          // hue 0-359
                s: 60 + Math.random() * 20,                  // saturation 60-80
                l: 50 + Math.random() * 10,                  // lightness 50-60
                hv: (Math.random() - 0.5) * 0.3              // hue velocity 微小变动
            });
        }
    }

    function draw() {
        if (!ctx || !canvas) return;
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // 连接线
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const dx = p.x - q.x;
                const dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 80) {
                    // 使用两粒子色相平均值作为连线颜色，透明度随距离衰减
                    const avgH = Math.floor((p.h + q.h) / 2);
                    const avgS = (p.s + q.s) / 2;
                    const avgL = (p.l + q.l) / 2;
                    const lineAlpha = 0.18 * (1 - dist / 80) * Math.min(p.alpha, q.alpha);
                    ctx.beginPath();
                    ctx.strokeStyle = `hsla(${avgH}, ${avgS}%, ${avgL}%, ${lineAlpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
        }

        // 粒子
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // 微调色相随时间变化
            p.h += p.hv;
            if (p.h < 0) p.h += 360;
            if (p.h >= 360) p.h -= 360;

            if (p.x < -10) p.x = rect.width + 10;
            if (p.x > rect.width + 10) p.x = -10;
            if (p.y < -10) p.y = rect.height + 10;
            if (p.y > rect.height + 10) p.y = -10;

            ctx.beginPath();
            // 使用 HSLA 渲染彩色粒子，保留原有透明度表现
            ctx.fillStyle = `hsla(${Math.floor(p.h)}, ${p.s}%, ${p.l}%, ${p.alpha})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    // 防抖 resize，节省重绘
    let resizeTimer = null;
    function onResize() {
        if (!canvas) return;
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCanvasSize();
            const area = Math.max(1, canvas.getBoundingClientRect().width * canvas.getBoundingClientRect().height);
            createParticles(Math.max(20, Math.floor(area / 20000)));
        }, 120);
    }

    function startParticles() {
        if (!canvas) return;
        canvas.style.display = 'block';
        initCanvasSize();
        const area = Math.max(1, canvas.getBoundingClientRect().width * canvas.getBoundingClientRect().height);
        const count = Math.max(20, Math.floor(area / 20000));
        createParticles(count);
        if (!animationId) animate();
        window.addEventListener('resize', onResize);
    }

    function stopParticles() {
        if (canvas) canvas.style.display = 'none';
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        window.removeEventListener('resize', onResize);
    }

    // 当页面不可见时暂停粒子以节省资源
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopParticles();
        } else {
            if (enableParticles && canvas) startParticles();
        }
    });

    // 根据配置启动/停止粒子
    if (enableParticles && canvas) {
        startParticles();
    } else {
        stopParticles();
    }

    // 限制输入内容
    const checkInputEl = document.getElementById('checkInput');
    if (checkInputEl) {
        checkInputEl.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
        });
    }

    // 流量检测按钮（在 DOMContentLoaded 内初始化，避免外部未定义）
    const checkBtn = document.getElementById('checkBtn');
    if (checkBtn) {
        checkBtn.addEventListener('click', function() {
            const alertBox = document.createElement('div');
            alertBox.className = 'auto-dismiss-alert';
            alertBox.textContent = '本功能为VIP专属，请联系客服开通';
            document.body.appendChild(alertBox);
            setTimeout(() => {
                if (alertBox.parentNode) alertBox.parentNode.removeChild(alertBox);
            }, 1500);
        });
    }

    // 设置更新时间（安全检查元素存在）
    const updateTimeElement = document.getElementById('updateTime');
    if (updateTimeElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        updateTimeElement.textContent = `${year}年${month}月${day}日`;
    }

    // 导航栏滚动效果
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            } else {
                header.style.backgroundColor = 'white';
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            }
        });
    }

});

// 在pagemain.js的DOMContentLoaded事件中添加以下代码

// 微信二维码显示控制
const wechatBtn = document.getElementById('wechatBtn');
const wechatQrcode = document.getElementById('wechatQrcode');

if (wechatBtn && wechatQrcode) {
    // 点击微信按钮也显示/隐藏二维码
    wechatBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        wechatQrcode.style.display = wechatQrcode.style.display === 'block' ? 'none' : 'block';
    });
    
    // 点击页面其他地方隐藏二维码
    document.addEventListener('click', function() {
        wechatQrcode.style.display = 'none';
    });
    
    // 防止二维码内部点击导致隐藏
    wechatQrcode.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// 置顶功能
const toTopBtn = document.getElementById('toTop');
if (toTopBtn) {
    toTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 置底功能
const toBottomBtn = document.getElementById('toBottom');
if (toBottomBtn) {
    toBottomBtn.addEventListener('click', function() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
}

// 滚动时控制按钮显示/隐藏
window.addEventListener('scroll', function() {
    const floatingActions = document.querySelector('.floating-actions');
    if (floatingActions) {
        // 页面滚动超过300px才显示浮动按钮
        if (window.scrollY > 300) {
            floatingActions.style.opacity = '1';
            floatingActions.style.pointerEvents = 'auto';
        } else {
            floatingActions.style.opacity = '0';
            floatingActions.style.pointerEvents = 'none';
        }
    }
});
