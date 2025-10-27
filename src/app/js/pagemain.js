document.addEventListener('DOMContentLoaded', function () {
    // 读取并应用截图默认可见性（仅根据 HTML 的 data-visible 控制）
    const screenshotsContainer = document.getElementById('appScreenshots');
    let screenshotsVisible = true;
    if (screenshotsContainer && screenshotsContainer.dataset && typeof screenshotsContainer.dataset.visible !== 'undefined') {
        screenshotsVisible = screenshotsContainer.dataset.visible === 'true';
    }
    if (screenshotsContainer) {
        screenshotsContainer.style.display = screenshotsVisible ? 'block' : 'none';
        screenshotsContainer.setAttribute('aria-hidden', screenshotsVisible ? 'false' : 'true');
    }

    // 设置页面“更新时间”（格式：YYYY年M月，例如：2025年10月）
    (function setUpdateTime() {
        const el = document.getElementById('updateTime');
        if (!el) return;
        const d = new Date();
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        el.textContent = `${year}年${month}月`;
        el.setAttribute('aria-live', 'polite');
    })();

    // 下载按钮点击/键盘事件（图标 + 文本会被替换为状态图标，随后恢复）
    const downloadButtons = document.querySelectorAll('.platform-download-btn');
    downloadButtons.forEach(button => {
        const activate = (evt) => {
            // 支持键盘的 Enter / Space
            if (evt.type === 'keydown' && evt.key !== 'Enter' && evt.key !== ' ') return;
            evt.preventDefault();
            const platform = button.getAttribute('data-platform') || '';
            const originalContent = button.innerHTML;

            // 显示下载中状态（仅图标）
            button.innerHTML = `<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>`;
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');

            // 模拟下载过程
            setTimeout(() => {
                const downloadLink = document.createElement('a');
                const ext = getExtensionByPlatform(platform);
                const filename = `畅游云免_${platform}.${ext}`;
                downloadLink.href = `downloads/${filename}`;
                downloadLink.download = filename;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // 显示下载完成状态（仅图标）
                button.innerHTML = `<i class="fa fa-check" aria-hidden="true"></i>`;
                button.setAttribute('aria-busy', 'false');

                // 2秒后恢复原始状态（包含图标与文本）
                setTimeout(() => {
                    button.innerHTML = originalContent;
                    button.disabled = false;
                }, 2000);
            }, 1500);
        };

        button.addEventListener('click', activate);
        button.addEventListener('keydown', activate);
    });

    // 根据平台获取文件扩展名
    function getExtensionByPlatform(platform) {
        switch ((platform || '').toLowerCase()) {
            case 'android': return 'apk';
            case 'ios': return 'ipa';
            case 'windows': return 'exe';
            case 'macos': return 'dmg';
            case 'linux': return 'deb';
            default: return 'zip';
        }
    }

    // 图片加载错误处理（保持原有占位逻辑并使用 encodeURIComponent）
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (this.classList.contains('app-icon')) {
                const svg = '<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f1f1f1" rx="24" ry="24"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bdc3c7" font-size="16">应用图标</text></svg>';
                this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
            } else if (this.classList.contains('screenshot-item')) {
                const svg = '<svg width="320" height="568" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f1f1f1" rx="8" ry="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bdc3c7" font-size="14">截图不可用</text></svg>';
                this.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
                this.style.objectFit = 'contain';
            }
        });
    });
});