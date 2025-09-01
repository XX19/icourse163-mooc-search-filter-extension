// 调试推荐栏识别问题
console.log('🔍 开始调试推荐栏识别问题...');

// 查找所有包含推荐栏相关类或文本的元素
const elementsWithRecommendation = document.querySelectorAll('*');
const foundElements = [];

// 推荐栏相关的类名
const recommendationClasses = [
    '_2PS-M', 'muyZB', 'mooc-filtered-viewable',
    '_2uL3Z', 'commonCourseCardItem', '_3wiyq', '_3Ix3w',
    '_3qcQi', '_3nEA2', '_3P-nb', '_1aA0a', '_1vBXE',
    'Foapm', '_27a1G', '_7eOpg', '_1C9Fh', '_31HuX',
    '_16BE9', '_3MZCa', '_1XPiB', 'XUbDd', '_3t2FI',
    '_1hyN-', '_1DAdE', 'UeeBB', '_3FqLE', '_397I5',
    '_2xeqP', '_2RHCp', '_1XPEe', '_3C8uI'
];

elementsWithRecommendation.forEach((element, index) => {
    const className = element.className;
    const text = element.textContent.trim();
    
    if (typeof className === 'string') {
        for (const recClass of recommendationClasses) {
            if (className.includes(recClass)) {
                foundElements.push({
                    element: element,
                    className: className,
                    type: recClass,
                    text: element.textContent.substring(0, 100),
                    tagName: element.tagName
                });
                console.log(`找到 ${recClass} 元素 ${foundElements.length}:`, {
                    tagName: element.tagName,
                    className: className,
                    text: element.textContent.substring(0, 100)
                });
                break; // 只记录一次
            }
        }
    }
    
    // 检查推荐栏文本
    if (text.includes('为你推荐') || text.includes('Recommended for you')) {
        foundElements.push({
            element: element,
            className: className,
            type: '推荐栏文本',
            text: element.textContent.substring(0, 100),
            tagName: element.tagName
        });
        console.log(`找到推荐栏文本元素 ${foundElements.length}:`, {
            tagName: element.tagName,
            className: className,
            text: element.textContent.substring(0, 100)
        });
    }
});

console.log(`📊 总共找到 ${foundElements.length} 个包含推荐栏类的元素`);

// 检查这些元素是否包含"已结束"文本
foundElements.forEach((item, index) => {
    if (item.text.includes('已结束')) {
        console.log(`⚠️ 元素 ${index + 1} (${item.type}) 包含"已结束"文本:`, {
            className: item.className,
            text: item.text
        });
    }
});

// 测试 isInRecommendationSection 函数
function testIsInRecommendationSection(element) {
    let current = element;
    for (let i = 0; i < 10 && current && current.parentElement; i++) {
        const className = current.className;
        const text = current.textContent.trim();
        console.log(`层级 ${i}: className = "${className}"`);
        
        if (typeof className === 'string') {
            // 推荐栏相关的类名
            const recommendationClasses = [
                '_2PS-M', 'muyZB', 'mooc-filtered-viewable',
                '_2uL3Z', 'commonCourseCardItem', '_3wiyq', '_3Ix3w',
                '_3qcQi', '_3nEA2', '_3P-nb', '_1aA0a', '_1vBXE',
                'Foapm', '_27a1G', '_7eOpg', '_1C9Fh', '_31HuX',
                '_16BE9', '_3MZCa', '_1XPiB', 'XUbDd', '_3t2FI',
                '_1hyN-', '_1DAdE', 'UeeBB', '_3FqLE', '_397I5',
                '_2xeqP', '_2RHCp', '_1XPEe', '_3C8uI'
            ];
            
            for (const recClass of recommendationClasses) {
                if (className.includes(recClass)) {
                    console.log(`✅ 在第 ${i} 层发现 ${recClass} 类`);
                    return true;
                }
            }
        }
        
        // 检查推荐栏文本
        if (text.includes('为你推荐') || text.includes('Recommended for you')) {
            console.log(`✅ 在第 ${i} 层发现推荐栏文本: "${text.substring(0, 50)}..."`);
            return true;
        }
        
        current = current.parentElement;
    }
    console.log(`❌ 未发现推荐栏类`);
    return false;
}

// 测试一个包含"已结束"的元素
const endedElements = document.querySelectorAll('*');
endedElements.forEach(element => {
    const text = element.textContent.trim();
    if (text.includes('已结束') && text.length < 200) {
        console.log(`\n🧪 测试元素: "${text}"`);
        console.log(`元素类名: "${element.className}"`);
        const result = testIsInRecommendationSection(element);
        console.log(`是否在推荐栏中: ${result}`);
        break; // 只测试第一个
    }
});

console.log('🎉 调试完成！');
