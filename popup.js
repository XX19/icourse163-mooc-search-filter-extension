// 弹出窗口脚本
document.addEventListener('DOMContentLoaded', function() {
    const statusDiv = document.getElementById('status');
    const statusIcon = statusDiv.querySelector('.status-icon');
    const statusText = statusDiv.querySelector('.status-text');
    const refreshBtn = document.getElementById('refreshBtn');
    const toggleBtn = document.getElementById('toggleBtn');

    // 检查当前页面状态
    function checkPageStatus() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            
            if (currentTab.url.includes('icourse163.org')) {
                // 在MOOC网站上
                statusDiv.className = 'status active';
                statusIcon.textContent = '✅';
                statusText.textContent = '插件已激活';
                toggleBtn.disabled = false;
                
                // 检查筛选按钮是否存在
                chrome.scripting.executeScript({
                    target: {tabId: currentTab.id},
                    function: () => {
                        return !!document.getElementById('mooc-filter-btn');
                    }
                }, (results) => {
                    if (results && results[0] && results[0].result) {
                        statusText.textContent = '筛选功能已就绪';
                    } else {
                        statusText.textContent = '正在初始化筛选功能...';
                    }
                });
            } else {
                // 不在MOOC网站上
                statusDiv.className = 'status inactive';
                statusIcon.textContent = '❌';
                statusText.textContent = '请在MOOC网站上使用';
                toggleBtn.disabled = true;
            }
        });
    }

    // 刷新页面按钮
    refreshBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.reload(tabs[0].id);
            window.close();
        });
    });

    // 切换筛选按钮
    toggleBtn.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: () => {
                    const filterBtn = document.getElementById('mooc-filter-btn');
                    if (filterBtn) {
                        filterBtn.click();
                        return true;
                    }
                    return false;
                }
            }, (results) => {
                if (results && results[0] && results[0].result) {
                    statusText.textContent = '筛选状态已切换';
                } else {
                    statusText.textContent = '筛选按钮未找到';
                }
            });
        });
    });

    // 初始化检查
    checkPageStatus();

    // 监听标签页更新
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.active) {
            checkPageStatus();
        }
    });
});
