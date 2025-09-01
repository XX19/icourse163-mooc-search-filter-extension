// 调试按钮插入位置问题
console.log('🔍 调试按钮插入位置问题...');

// 1. 检查当前页面上是否有筛选按钮
const existingButton = document.getElementById('mooc-filter-btn');
if (existingButton) {
    console.log('✅ 筛选按钮已存在');
    console.log('按钮位置:', existingButton.offsetParent ? '已插入' : '未插入到DOM');
    console.log('按钮可见性:', existingButton.style.display, existingButton.style.visibility);
    console.log('按钮位置坐标:', existingButton.offsetLeft, existingButton.offsetTop);
} else {
    console.log('❌ 筛选按钮不存在');
}

// 2. 查找"智慧课程"元素
console.log('\n🎯 查找"智慧课程"元素...');
const allElements = document.querySelectorAll('*');
let zhihuiElement = null;
let zhihuiContainer = null;

for (const element of allElements) {
    if (element.textContent.trim() === '智慧课程') {
        zhihuiElement = element;
        console.log('✅ 找到"智慧课程"元素:');
        console.log('  标签:', element.tagName);
        console.log('  类名:', element.className);
        console.log('  父元素:', element.parentElement ? element.parentElement.tagName + '.' + element.parentElement.className : '无');
        
        // 向上查找合适的容器
        let container = element;
        for (let i = 0; i < 5; i++) {
            if (container && container.tagName === 'DIV' && container.children.length > 1) {
                zhihuiContainer = container;
                console.log(`  向上第${i+1}层容器:`, container.tagName + '.' + container.className);
                console.log('  容器子元素数量:', container.children.length);
                break;
            }
            container = container.parentElement;
        }
        break;
    }
}

if (!zhihuiElement) {
    console.log('❌ 未找到"智慧课程"元素');
    
    // 查找包含"智慧课程"的元素
    for (const element of allElements) {
        if (element.textContent.includes('智慧课程')) {
            console.log('找到包含"智慧课程"的元素:', element.tagName + '.' + element.className);
            console.log('完整文本:', element.textContent.trim());
            break;
        }
    }
}

// 3. 检查页面结构
console.log('\n🏗️ 检查页面结构...');
const possibleContainers = [
    '.filter-container',
    '.course-filter', 
    '.filter-area',
    '.search-filter',
    '[class*="filter"]',
    '.search-result-header',
    '.result-header',
    '.course-list-header',
    '.main-content',
    '.content',
    'main',
    '.search-result',
    '.course-list'
];

possibleContainers.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`✅ ${selector}:`, element.tagName + '.' + element.className);
        console.log('  子元素数量:', element.children.length);
        console.log('  位置:', element.offsetLeft, element.offsetTop);
    }
});

// 4. 手动创建并插入按钮
console.log('\n🔧 手动创建并插入按钮...');

// 创建按钮容器
const filterContainer = document.createElement('div');
filterContainer.className = 'mooc-filter-container';
filterContainer.style.cssText = `
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 15px;
    margin: 15px 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    z-index: 1000;
    position: relative;
`;

// 创建按钮
const button = document.createElement('button');
button.id = 'mooc-filter-btn';
button.className = 'mooc-filter-button';
button.innerHTML = '🔍 显示可查看课程';
button.title = '点击筛选显示已结束且可查看内容的课程';
button.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1001;
    min-width: 150px;
`;

// 添加点击事件
button.addEventListener('click', () => {
    console.log('按钮被点击！');
    // 这里可以调用筛选函数
});

filterContainer.appendChild(button);

// 5. 尝试插入到不同位置
console.log('\n📍 尝试插入到不同位置...');

// 位置1: 智慧课程旁边
if (zhihuiContainer) {
    console.log('尝试插入到智慧课程容器中...');
    zhihuiContainer.insertBefore(filterContainer, zhihuiContainer.firstChild);
    console.log('✅ 已插入到智慧课程容器');
} else if (zhihuiElement) {
    console.log('尝试插入到智慧课程父元素中...');
    zhihuiElement.parentElement.insertBefore(filterContainer, zhihuiElement);
    console.log('✅ 已插入到智慧课程父元素');
} else {
    // 位置2: 页面顶部
    console.log('智慧课程未找到，插入到页面顶部...');
    const firstContentElement = document.querySelector('header, nav, .header, .nav, .banner, .top');
    if (firstContentElement && firstContentElement.nextSibling) {
        document.body.insertBefore(filterContainer, firstContentElement.nextSibling);
    } else {
        document.body.insertBefore(filterContainer, document.body.firstChild);
    }
    console.log('✅ 已插入到页面顶部');
}

// 6. 验证按钮是否可见
setTimeout(() => {
    console.log('\n🔍 验证按钮是否可见...');
    const newButton = document.getElementById('mooc-filter-btn');
    if (newButton) {
        console.log('✅ 按钮已创建');
        console.log('按钮位置:', newButton.offsetLeft, newButton.offsetTop);
        console.log('按钮尺寸:', newButton.offsetWidth, newButton.offsetHeight);
        console.log('按钮可见性:', newButton.style.display, newButton.style.visibility);
        console.log('按钮在视口内:', newButton.offsetTop < window.innerHeight);
        
        // 如果按钮不在视口内，滚动到按钮位置
        if (newButton.offsetTop > window.innerHeight) {
            console.log('按钮不在视口内，滚动到按钮位置...');
            newButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        console.log('❌ 按钮创建失败');
    }
}, 1000);

console.log('\n🎉 调试完成！');
