// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 显示通知并在3秒后自动消失
    const notification = document.getElementById('notification');

    setTimeout(() => {
        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }, 100);

    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    mobileMenuBtn.addEventListener('click', function () {
        mobileNav.classList.toggle('show');
    });

    // 导航链接激活状态
    const sections = document.querySelectorAll('.tutorial-section');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', function () {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // 控制返回顶部按钮显示/隐藏
        const backToTopBtn = document.getElementById('back-to-top');
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 返回顶部功能
    document.getElementById('back-to-top').addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 点击导航链接后关闭移动菜单
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileNav.classList.remove('show');
        });
    });
});

// 添加动态日期显示
document.addEventListener('DOMContentLoaded', function () {


    const updateTimeElement = document.getElementById('update-time');
    if (updateTimeElement) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1; // 月份从0开始，需要+1
        updateTimeElement.textContent = `${year}年${month}月`;
    }

});