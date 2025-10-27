// 等待DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 侧边栏切换（移动端）
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('show');
  });
  
  // 章节折叠/展开功能
  const sectionTitles = document.querySelectorAll('.section-title');
  
  sectionTitles.forEach(title => {
    title.addEventListener('click', () => {
      const content = title.nextElementSibling;
      content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
  });
  
  // 平滑滚动到锚点
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 在移动设备上点击导航后关闭侧边栏
      if (window.innerWidth <= 768) {
        sidebar.classList.remove('show');
      }
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // 更新活跃导航项
        document.querySelectorAll('.toc-link').forEach(link => {
          link.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });
  
  // 滚动监听 - 更新导航栏样式和回到顶部按钮
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', () => {
    // 导航栏滚动效果
    if (window.scrollY > 50) {
      navbar.style.backgroundColor = '#fff';
      navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
    } else {
      navbar.style.backgroundColor = '#fff';
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    // 回到顶部按钮显示/隐藏
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
    
    // 滚动时更新活跃导航项
    const sections = document.querySelectorAll('.terms-section');
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.toc-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  // 回到顶部功能
  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // 初始化 - 默认展开所有章节
  document.querySelectorAll('.section-content').forEach(content => {
    content.style.display = 'block';
  });
});


// 自动设置当前日期
const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // getMonth() 返回 0-11，所以需要 +1
const day = currentDate.getDate();

const dateElement = document.getElementById('currentDate');
if (dateElement) {
  dateElement.textContent = `${year}年${month}月${day}日`;
}