document.addEventListener('DOMContentLoaded', function() {
    // 粒子背景效果
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = '#4a6cf7'; // 默认粒子颜色
    
    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // 粒子类
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = particleColor;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 边界检测
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // 初始化粒子
    function initParticles(count = 100) {
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    
    // 连接粒子的线
    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `${particleColor}${Math.floor(255 - (distance * 2.55)).toString(16).padStart(2, '0')}`;
                    ctx.lineWidth = 0.2;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    
    // 初始化粒子并开始动画
    initParticles();
    animateParticles();
    
    // 登录标签切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForms = document.querySelectorAll('.login-form');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            
            // 切换按钮状态
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 切换表单显示
            loginForms.forEach(form => form.classList.remove('active'));
            document.getElementById(`${tab}-form`).classList.add('active');
            
            // 更改粒子颜色并重新初始化粒子（模拟刷新效果）
            switch(tab) {
                case 'agent':
                    particleColor = '#4a6cf7'; // 蓝色
                    break;
                case 'user':
                    particleColor = '#36d399'; // 绿色
                    break;
                case 'admin':
                    particleColor = '#f59e0b'; // 橙色
                    break;
            }
            
            // 添加切换动画效果
            canvas.style.opacity = '0';
            setTimeout(() => {
                initParticles();
                canvas.style.opacity = '1';
            }, 300);
        });
    });
    
    // 账户输入验证（只允许字母和数字）
    const usernameInputs = document.querySelectorAll('.username-input');
    usernameInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            const regex = /^[a-zA-Z0-9]$/;
            if (!regex.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault();
            }
        });
        
        // 输入后验证（防止粘贴非法字符）
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
        });
    });
    
    // 密码输入验证（只允许字母和数字）
    const passwordInputs = document.querySelectorAll('.password-input');
    passwordInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            const regex = /^[a-zA-Z0-9]$/;
            if (!regex.test(e.key) && e.key !== 'Backspace') {
                e.preventDefault();
            }
        });
        
        // 输入后验证（防止粘贴非法字符）
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
        });
    });
    
    // 密码显示切换
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordWrapper = this.parentElement;
            const passwordInput = passwordWrapper.querySelector('.password-input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    
    // 登录和注册按钮点击事件
    const actionBtns = document.querySelectorAll('.login-btn, .register-btn');
    const errorToast = document.getElementById('errorToast');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 显示错误提示
            errorToast.classList.add('show');
            
            // 3秒后隐藏提示
            setTimeout(() => {
                errorToast.classList.remove('show');
            }, 3000);
        });
    });
});