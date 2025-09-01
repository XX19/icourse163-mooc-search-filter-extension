// MOOC网站DOM结构分析脚本
// 在MOOC网站的控制台中运行此脚本

console.log('🔍 开始分析MOOC网站DOM结构...');

// 1. 查找可能的课程容器
const courseSelectors = [
    '.course-card',
    '.course-item',
    '.course-list-item',
    '[class*="course"]',
    '.m-courseCard',
    '.course-card-item',
    '.course-list .item',
    '.search-result-item',
    '.course-list',
    '.search-result'
];

console.log('📋 查找课程相关元素:');
courseSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        console.log(`✅ ${selector}: 找到 ${elements.length} 个元素`);
        if (elements.length <= 3) {
            elements.forEach((el, index) => {
                console.log(`   ${index + 1}. ${el.className} - ${el.textContent.substring(0, 50)}...`);
            });
        }
    } else {
        console.log(`❌ ${selector}: 未找到`);
    }
});

// 2. 查找筛选相关元素
const filterSelectors = [
    '.filter-container',
    '.course-filter',
    '.filter-area',
    '.search-filter',
    '[class*="filter"]',
    '.search-result-header',
    '.result-header',
    '.course-list-header'
];

console.log('\n🔍 查找筛选相关元素:');
filterSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
        console.log(`✅ ${selector}: 找到 ${elements.length} 个元素`);
        elements.forEach((el, index) => {
            console.log(`   ${index + 1}. ${el.className} - ${el.textContent.substring(0, 50)}...`);
        });
    } else {
        console.log(`❌ ${selector}: 未找到`);
    }
});

// 3. 查找状态相关元素
console.log('\n📊 查找状态相关元素:');
const statusElements = document.querySelectorAll('[class*="status"], [class*="state"]');
console.log(`找到 ${statusElements.length} 个状态相关元素:`);
statusElements.forEach((el, index) => {
    if (index < 10) { // 只显示前10个
        console.log(`   ${index + 1}. ${el.className} - "${el.textContent.trim()}"`);
    }
});

// 4. 查找按钮和链接
console.log('\n🔗 查找按钮和链接:');
const buttons = document.querySelectorAll('button, a, .btn, .button');
const relevantButtons = Array.from(buttons).filter(btn => {
    const text = btn.textContent.trim();
    return text.includes('可查看内容') || text.includes('查看内容') || 
           text.includes('立即学习') || text.includes('进入学习') ||
           text.includes('已结束') || text.includes('正在进行');
});

console.log(`找到 ${relevantButtons.length} 个相关按钮:`);
relevantButtons.forEach((btn, index) => {
    if (index < 10) {
        console.log(`   ${index + 1}. ${btn.tagName} - "${btn.textContent.trim()}"`);
    }
});

// 5. 分析页面结构
console.log('\n🏗️ 页面结构分析:');
const mainContainers = [
    'main',
    '.main-content',
    '.content',
    '.container',
    '.page-content',
    '.search-result',
    '.course-list'
];

mainContainers.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`✅ ${selector}: 存在`);
        console.log(`   子元素数量: ${element.children.length}`);
        console.log(`   高度: ${element.offsetHeight}px`);
    } else {
        console.log(`❌ ${selector}: 不存在`);
    }
});

// 6. 检查插件按钮
console.log('\n🎯 检查插件按钮:');
const pluginBtn = document.getElementById('mooc-filter-btn');
if (pluginBtn) {
    console.log('✅ 插件按钮存在');
    const rect = pluginBtn.getBoundingClientRect();
    console.log(`   位置: x=${rect.x}, y=${rect.y}, width=${rect.width}, height=${rect.height}`);
    console.log(`   是否在视口内: ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth}`);
    
    const style = window.getComputedStyle(pluginBtn);
    console.log(`   z-index: ${style.zIndex}`);
    console.log(`   display: ${style.display}`);
    console.log(`   visibility: ${style.visibility}`);
    console.log(`   opacity: ${style.opacity}`);
} else {
    console.log('❌ 插件按钮不存在');
}

// 7. 建议的插入位置
console.log('\n💡 建议的插入位置:');
const suggestedPositions = [
    '.search-result',
    '.course-list',
    '.main-content',
    'main',
    '.content'
];

suggestedPositions.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
        console.log(`✅ ${selector}: 可以作为插入位置`);
        console.log(`   位置: ${element.offsetTop}px from top`);
        console.log(`   可见性: ${element.offsetHeight > 0 ? '可见' : '不可见'}`);
    }
});

console.log('\n🎉 DOM结构分析完成！');
console.log('💡 提示: 如果插件按钮不可见，可能需要调整插入位置或z-index值。');
