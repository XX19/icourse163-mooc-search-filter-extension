// 验证插件代码是否正确更新
console.log('🔍 验证插件代码...');

// 检查函数名是否正确
if (typeof window.moocFilter !== 'undefined') {
    console.log('✅ 插件全局对象存在');
    console.log('可用方法:', Object.keys(window.moocFilter));
} else {
    console.log('❌ 插件全局对象不存在');
}

// 检查按钮文本
const button = document.getElementById('mooc-filter-btn');
if (button) {
    console.log('✅ 筛选按钮存在');
    console.log('按钮文本:', button.innerHTML);
    console.log('按钮标题:', button.title);
} else {
    console.log('❌ 筛选按钮不存在');
}

// 检查是否有旧的函数名
if (typeof filterClosedCourses !== 'undefined') {
    console.log('❌ 发现旧的函数名: filterClosedCourses');
} else {
    console.log('✅ 没有发现旧的函数名');
}

if (typeof filterViewableCourses !== 'undefined') {
    console.log('✅ 发现正确的函数名: filterViewableCourses');
} else {
    console.log('❌ 没有发现正确的函数名: filterViewableCourses');
}

// 手动测试筛选功能
console.log('\n🧪 手动测试筛选功能...');
if (window.moocFilter && window.moocFilter.filter) {
    console.log('调用筛选函数...');
    window.moocFilter.filter();
} else {
    console.log('无法调用筛选函数');
}

console.log('\n🎉 验证完成！');
