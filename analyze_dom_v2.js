// 更精确的MOOC网站DOM结构分析脚本
console.log('🔍 开始精确分析MOOC网站DOM结构...');

// 1. 查找所有包含"已结束"文本的元素
console.log('\n📋 查找包含"已结束"的元素:');
const allElements = document.querySelectorAll('*');
const endedElements = Array.from(allElements).filter(el => {
    return el.textContent.includes('已结束');
});

console.log(`找到 ${endedElements.length} 个包含"已结束"的元素:`);
endedElements.forEach((el, index) => {
    if (index < 10) {
        console.log(`   ${index + 1}. ${el.tagName}.${el.className} - "${el.textContent.trim().substring(0, 100)}..."`);
        console.log(`      父元素: ${el.parentElement.tagName}.${el.parentElement.className}`);
    }
});

// 2. 查找所有包含"可查看内容"的元素
console.log('\n🔗 查找包含"可查看内容"的元素:');
const viewContentElements = Array.from(allElements).filter(el => {
    return el.textContent.includes('可查看内容');
});

console.log(`找到 ${viewContentElements.length} 个包含"可查看内容"的元素:`);
viewContentElements.forEach((el, index) => {
    if (index < 5) {
        console.log(`   ${index + 1}. ${el.tagName}.${el.className} - "${el.textContent.trim()}"`);
    }
});

// 3. 查找所有div元素，分析可能的课程容器
console.log('\n🏗️ 分析所有div元素:');
const allDivs = document.querySelectorAll('div');
const courseLikeDivs = Array.from(allDivs).filter(div => {
    const text = div.textContent;
    return text.includes('已结束') || text.includes('课程') || text.includes('学习') || text.includes('人参加');
});

console.log(`找到 ${courseLikeDivs.length} 个可能的课程相关div:`);
courseLikeDivs.forEach((div, index) => {
    if (index < 10) {
        console.log(`   ${index + 1}. div.${div.className}`);
        console.log(`      内容: "${div.textContent.trim().substring(0, 100)}..."`);
        console.log(`      子元素数量: ${div.children.length}`);
    }
});

// 4. 查找所有class包含特定关键词的元素
console.log('\n🎯 查找特定class名的元素:');
const classKeywords = ['course', 'card', 'item', 'list', 'result', 'search'];
classKeywords.forEach(keyword => {
    const elements = document.querySelectorAll(`[class*="${keyword}"]`);
    if (elements.length > 0) {
        console.log(`✅ [class*="${keyword}"]: 找到 ${elements.length} 个元素`);
        elements.forEach((el, index) => {
            if (index < 3) {
                console.log(`   ${index + 1}. ${el.tagName}.${el.className}`);
            }
        });
    }
});

// 5. 分析页面结构层次
console.log('\n📊 页面结构层次分析:');
const body = document.body;
console.log('Body子元素:');
Array.from(body.children).forEach((child, index) => {
    if (index < 10) {
        console.log(`   ${index + 1}. ${child.tagName}.${child.className} - 高度: ${child.offsetHeight}px`);
    }
});

// 6. 查找所有文本节点，寻找课程信息
console.log('\n📝 查找课程相关文本:');
const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
);

const courseTexts = [];
let node;
while (node = walker.nextNode()) {
    const text = node.textContent.trim();
    if (text.includes('已结束') || text.includes('人参加') || 
        (text.includes('大学') && text.includes('教授'))) {
        courseTexts.push({
            text: text,
            parent: node.parentElement
        });
    }
}

console.log(`找到 ${courseTexts.length} 个课程相关文本:`);
courseTexts.forEach((item, index) => {
    if (index < 10) {
        console.log(`   ${index + 1}. "${item.text}"`);
        console.log(`      父元素: ${item.parent.tagName}.${item.parent.className}`);
    }
});

// 7. 检查插件按钮的可见性
console.log('\n🎯 插件按钮详细分析:');
const pluginBtn = document.getElementById('mooc-filter-btn');
if (pluginBtn) {
    const rect = pluginBtn.getBoundingClientRect();
    const style = window.getComputedStyle(pluginBtn);
    
    console.log('按钮信息:');
    console.log(`   HTML: ${pluginBtn.outerHTML}`);
    console.log(`   位置: x=${rect.x}, y=${rect.y}`);
    console.log(`   尺寸: width=${rect.width}, height=${rect.height}`);
    console.log(`   视口位置: top=${rect.top}, left=${rect.left}`);
    console.log(`   是否在视口内: ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth}`);
    
    // 检查是否有元素遮挡
    const elementsAtPoint = document.elementsFromPoint(rect.x + rect.width/2, rect.y + rect.height/2);
    console.log('按钮位置处的元素层次:');
    elementsAtPoint.forEach((el, index) => {
        if (index < 5) {
            console.log(`   ${index + 1}. ${el.tagName}.${el.className}`);
        }
    });
}

console.log('\n🎉 精确分析完成！');
console.log('💡 根据分析结果，我们可以确定实际的课程元素选择器。');
