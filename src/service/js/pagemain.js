// 模拟服务器数据
const serverData = {
    cpu: 32,
    memory: 68,
    disk: 82,
    network: 1.2,
    users: 1248,
    responseTime: 128,
    servers: [
        { id: 1, name: "主服务器", ip: "192.168.1.1", status: "online", cpu: 28, memory: 62 },
        { id: 2, name: "数据库服务器", ip: "192.168.1.2", status: "online", cpu: 45, memory: 78 },
        { id: 3, name: "应用服务器", ip: "192.168.1.3", status: "warning", cpu: 76, memory: 85 },
        { id: 4, name: "备份服务器", ip: "192.168.1.4", status: "online", cpu: 15, memory: 45 }
    ],
    networkHistory: [0.8, 0.9, 1.1, 1.3, 1.5, 1.4, 1.2, 1.1, 1.3, 1.2, 1.0, 1.2],
    usersHistory: [950, 1020, 1100, 1050, 1180, 1250, 1300, 1280, 1220, 1180, 1230, 1248]
};

// 更新UI显示
function updateUI(data) {
    // 更新基本指标
    document.getElementById('cpu-usage').textContent = `${data.cpu}%`;
    document.getElementById('cpu-progress').style.width = `${data.cpu}%`;
    
    document.getElementById('memory-usage').textContent = `${data.memory}%`;
    document.getElementById('memory-progress').style.width = `${data.memory}%`;
    
    document.getElementById('disk-usage').textContent = `${data.disk}%`;
    document.getElementById('disk-progress').style.width = `${data.disk}%`;
    
    document.getElementById('network-traffic').textContent = `${data.network} Gbps`;
    
    document.getElementById('online-users').textContent = data.users.toLocaleString();
    
    document.getElementById('response-time').textContent = `${data.responseTime} ms`;
    document.getElementById('response-progress').style.width = `${Math.min(data.responseTime / 500 * 100, 100)}%`;
    
    // 更新服务器列表
    const serversList = document.getElementById('servers-list');
    serversList.innerHTML = '';
    
    data.servers.forEach(server => {
        const serverItem = document.createElement('div');
        serverItem.className = 'server-item';
        
        serverItem.innerHTML = `
            <div class="server-info">
                <span class="indicator status-${server.status}"></span>
                <div>
                    <div class="server-name">${server.name}</div>
                    <div class="server-ip">${server.ip}</div>
                    <div class="progress-bar">
                        <div class="progress-fill ${getProgressClass(server.cpu)}" style="width: ${server.cpu}%"></div>
                    </div>
                    <div style="display: flex; gap: 1rem; margin-top: 0.25rem; font-size: 0.75rem; color: var(--gray);">
                        <span>CPU: ${server.cpu}%</span>
                        <span>内存: ${server.memory}%</span>
                    </div>
                </div>
            </div>
            <div>${getStatusText(server.status)}</div>
        `;
        
        serversList.appendChild(serverItem);
    });
    
    // 更新最后更新时间
    const now = new Date();
    document.getElementById('last-updated').textContent = now.toLocaleString();
    
    // 更新全局状态
    updateGlobalStatus(data.servers);
    
    // 绘制图表
    drawNetworkChart(data.networkHistory);
    drawUsersChart(data.usersHistory);
}

// 获取进度条颜色类
function getProgressClass(value) {
    if (value < 50) return 'progress-primary';
    if (value < 80) return 'progress-secondary';
    if (value < 90) return 'progress-warning';
    return 'progress-danger';
}

// 获取状态文本
function getStatusText(status) {
    switch(status) {
        case 'online': return '正常运行';
        case 'warning': return '需要注意';
        case 'offline': return '已离线';
        default: return '未知状态';
    }
}

// 更新全局状态
function updateGlobalStatus(servers) {
    const hasOffline = servers.some(s => s.status === 'offline');
    const hasWarning = servers.some(s => s.status === 'warning');
    
    const globalStatus = document.getElementById('global-status');
    const statusText = document.getElementById('status-text');
    
    if (hasOffline) {
        globalStatus.className = 'indicator status-offline';
        statusText.textContent = '部分服务器已离线';
    } else if (hasWarning) {
        globalStatus.className = 'indicator status-warning';
        statusText.textContent = '部分服务器需要注意';
    } else {
        globalStatus.className = 'indicator status-online';
        statusText.textContent = '所有服务器正常运行';
    }
}

// 绘制网络流量图表
function drawNetworkChart(data) {
    const canvas = document.getElementById('network-chart');
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置画布尺寸以匹配显示尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    
    // 计算数据范围
    const maxValue = Math.max(...data) * 1.1;
    const minValue = Math.min(...data) * 0.9;
    const valueRange = maxValue - minValue;
    
    // 计算X轴步长
    const stepX = innerWidth / (data.length - 1);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // 水平线
    for (let i = 0; i <= 4; i++) {
        const y = padding + innerHeight * (1 - i / 4);
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
    }
    
    ctx.stroke();
    
    // 绘制数据线
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + innerHeight * (1 - (value - minValue) / valueRange);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // 填充区域
    ctx.beginPath();
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + innerHeight * (1 - (value - minValue) / valueRange);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(padding + (data.length - 1) * stepX, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
}

// 绘制用户数量图表
function drawUsersChart(data) {
    const canvas = document.getElementById('users-chart');
    const ctx = canvas.getContext('2d');
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置画布尺寸以匹配显示尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;
    
    // 计算数据范围
    const maxValue = Math.max(...data) * 1.1;
    const minValue = Math.min(...data) * 0.9;
    const valueRange = maxValue - minValue;
    
    // 计算X轴步长
    const stepX = innerWidth / (data.length - 1);
    
    // 绘制网格线
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;
    
    // 水平线
    for (let i = 0; i <= 4; i++) {
        const y = padding + innerHeight * (1 - i / 4);
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
    }
    
    ctx.stroke();
    
    // 绘制数据线
    ctx.beginPath();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + innerHeight * (1 - (value - minValue) / valueRange);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // 填充区域
    ctx.beginPath();
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    
    data.forEach((value, index) => {
        const x = padding + index * stepX;
        const y = padding + innerHeight * (1 - (value - minValue) / valueRange);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.lineTo(padding + (data.length - 1) * stepX, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();
}

// 生成随机波动数据
function generateFluctuatedData(baseData, range = 0.1) {
    return baseData.map(value => {
        const fluctuation = (Math.random() - 0.5) * 2 * range * value;
        return Math.max(0, value + fluctuation);
    });
}

// 生成随机整数波动
function generateFluctuatedInt(baseValue, range = 10) {
    const fluctuation = Math.floor((Math.random() - 0.5) * 2 * range);
    return Math.max(0, baseValue + fluctuation);
}

// 刷新数据
function refreshData() {
    // 显示加载指示器
    document.getElementById('refresh-indicator').style.display = 'inline-block';
    
    // 模拟网络延迟
    setTimeout(() => {
        // 生成波动数据
        const newData = {
            ...serverData,
            cpu: generateFluctuatedInt(serverData.cpu, 5),
            memory: generateFluctuatedInt(serverData.memory, 5),
            disk: generateFluctuatedInt(serverData.disk, 2),
            network: parseFloat(generateFluctuatedData([serverData.network], 0.2)[0].toFixed(1)),
            users: generateFluctuatedInt(serverData.users, 50),
            responseTime: generateFluctuatedInt(serverData.responseTime, 15),
            networkHistory: generateFluctuatedData(serverData.networkHistory, 0.15),
            usersHistory: generateFluctuatedData(serverData.usersHistory, 0.1).map(v => Math.floor(v)),
            servers: serverData.servers.map(server => ({
                ...server,
                cpu: generateFluctuatedInt(server.cpu, 8),
                memory: generateFluctuatedInt(server.memory, 8)
            }))
        };
        
        // 随机更改一个服务器状态
        if (Math.random() > 0.7) {
            const randomIndex = Math.floor(Math.random() * newData.servers.length);
            const currentStatus = newData.servers[randomIndex].status;
            
            if (currentStatus === 'online') {
                newData.servers[randomIndex].status = Math.random() > 0.5 ? 'warning' : 'online';
            } else if (currentStatus === 'warning') {
                newData.servers[randomIndex].status = Math.random() > 0.7 ? 'online' : 'warning';
            }
        }
        
        // 更新UI
        updateUI(newData);
        
        // 隐藏加载指示器
        document.getElementById('refresh-indicator').style.display = 'none';
        
    }, 800);
}

// 初始化页面
updateUI(serverData);

// 设置定时刷新 (每10秒)
setInterval(refreshData, 10000);

// 窗口大小改变时重绘图表
window.addEventListener('resize', () => {
    drawNetworkChart(serverData.networkHistory);
    drawUsersChart(serverData.usersHistory);
});

// 允许用户点击刷新图标手动刷新
document.getElementById('refresh-indicator').parentElement.addEventListener('click', refreshData);