// 中国大学MOOC课程筛选器 - 内容脚本
(function() {
    'use strict';

    console.log('🎓 MOOC课程筛选器插件已加载');

    // 调试模式
    const DEBUG = true;

    function log(...args) {
        if (DEBUG) {
            console.log('[MOOC筛选器]', ...args);
        }
    }

    // 创建筛选按钮
    function createFilterButton() {
        const button = document.createElement('button');
        button.id = 'mooc-filter-btn';
        button.className = 'mooc-filter-button';
        button.innerHTML = '已结束可查看 <span id="filter-count"></span>';
        // 去除鼠标悬停提示
        
        button.addEventListener('click', toggleFilter);
        log('筛选按钮已创建');
        return button;
    }

    // 切换"结束无法查看"筛选状态
    function toggleUnviewableFilter(event) {
        log('切换"结束无法查看"筛选状态');
        const button = document.getElementById('mooc-clear-btn');
        const isFiltered = button.classList.contains('active');
        
        if (isFiltered) {
            // 如果已经筛选，检查是否点击了❌部分
            const rect = button.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const buttonWidth = rect.width;
            
            // 检查是否点击了❌取消部分
            const cancelSpan = button.querySelector('span');
            if (cancelSpan) {
                const spanRect = cancelSpan.getBoundingClientRect();
                const spanClickX = event.clientX - spanRect.left;
                const spanClickY = event.clientY - spanRect.top;
                
                if (spanClickX >= 0 && spanClickX <= spanRect.width && 
                    spanClickY >= 0 && spanClickY <= spanRect.height) {
                    // 点击了❌取消部分
                    showAllEndedCourses();
                    button.innerHTML = '结束无法查看';
                    button.classList.remove('active');
                    log('已取消"结束无法查看"筛选');
                }
            } else {
                // 如果没有找到span，使用原来的区域检测方法
                if (clickX > buttonWidth * 0.8) {
                    showAllEndedCourses();
                    button.innerHTML = '结束无法查看';
                    button.classList.remove('active');
                    log('已取消"结束无法查看"筛选');
                }
            }
            // 如果点击的是左侧部分，不执行任何操作
        } else {
            // 检查是否已经点击过"已结束"选项（使用主动监听 + 快速重试）
            let endedOption = document.querySelector('._8d-t-._1r2Xf');
            if (!endedOption || !endedOption.textContent.includes('已结束')) {
                // 如果没有找到，使用主动监听 + 快速重试
                let retryCount = 0;
                const maxRetries = 3;
                const retryInterval = 50; // 50ms间隔，更快速
                
                // 创建MutationObserver监听页面变化
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const target = mutation.target;
                            if (target.classList.contains('_8d-t-') && target.classList.contains('_1r2Xf') && 
                                target.textContent.includes('已结束')) {
                                // 检测到目标元素，立即执行
                                observer.disconnect();
                                filterUnviewableCourses();
                                log('通过监听检测到"已结束"选项，已应用"结束无法查看"筛选');
                            }
                        }
                    });
                });
                
                // 监听整个文档的class变化
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
                
                // 同时进行快速重试
                const retryDetection = () => {
                    retryCount++;
                    endedOption = document.querySelector('._8d-t-._1r2Xf');
                    
                    if (endedOption && endedOption.textContent.includes('已结束')) {
                        // 找到了，停止监听并执行
                        observer.disconnect();
                        filterUnviewableCourses();
                        log('重试后找到"已结束"选项，已应用"结束无法查看"筛选');
                    } else if (retryCount < maxRetries) {
                        // 继续重试
                        setTimeout(retryDetection, retryInterval);
                    } else {
                        // 重试次数用完，停止监听并显示提示信息
                        observer.disconnect();
                        showTipMessage('先点击"已结束"进行筛选后再点击此处', button);
                        log(`重试${maxRetries}次后仍未检测到"已结束"选项被点击，显示提示信息`);
                    }
                };
                
                setTimeout(retryDetection, retryInterval);
                return;
            }
            
            // 应用筛选，只显示已结束但无法查看内容的课程
            filterUnviewableCourses();
            log('已应用"结束无法查看"筛选');
        }
    }

    // 切换筛选状态
    function toggleFilter(event) {
        log('切换筛选状态');
        const button = document.getElementById('mooc-filter-btn');
        const isFiltered = button.classList.contains('active');
        
        if (isFiltered) {
            // 如果已经筛选，检查是否点击了❌部分
            const rect = button.getBoundingClientRect();
            const clickX = event.clientX - rect.left;
            const buttonWidth = rect.width;
            
            // 检查是否点击了❌取消部分
            const cancelSpan = button.querySelector('span');
            if (cancelSpan) {
                const spanRect = cancelSpan.getBoundingClientRect();
                const spanClickX = event.clientX - spanRect.left;
                const spanClickY = event.clientY - spanRect.top;
                
                if (spanClickX >= 0 && spanClickX <= spanRect.width && 
                    spanClickY >= 0 && spanClickY <= spanRect.height) {
                    // 点击了❌取消部分
                    showAllEndedCourses();
                    button.innerHTML = '已结束可查看 <span id="filter-count"></span>';
                    button.classList.remove('active');
                    log('已取消筛选');
                }
            } else {
                // 如果没有找到span，使用原来的区域检测方法
                if (clickX > buttonWidth * 0.8) {
                    showAllEndedCourses();
                    button.innerHTML = '已结束可查看 <span id="filter-count"></span>';
                    button.classList.remove('active');
                    log('已取消筛选');
                }
            }
            // 如果点击的是左侧部分，不执行任何操作
        } else {
            // 检查是否已经点击过"已结束"选项（使用主动监听 + 快速重试）
            let endedOption = document.querySelector('._8d-t-._1r2Xf');
            if (!endedOption || !endedOption.textContent.includes('已结束')) {
                // 如果没有找到，使用主动监听 + 快速重试
                let retryCount = 0;
                const maxRetries = 3;
                const retryInterval = 50; // 50ms间隔，更快速
                
                // 创建MutationObserver监听页面变化
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const target = mutation.target;
                            if (target.classList.contains('_8d-t-') && target.classList.contains('_1r2Xf') && 
                                target.textContent.includes('已结束')) {
                                // 检测到目标元素，立即执行
                                observer.disconnect();
                                filterViewableCourses();
                                log('通过监听检测到"已结束"选项，已应用筛选');
                            }
                        }
                    });
                });
                
                // 监听整个文档的class变化
                observer.observe(document.body, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
                
                // 同时进行快速重试
                const retryDetection = () => {
                    retryCount++;
                    endedOption = document.querySelector('._8d-t-._1r2Xf');
                    
                    if (endedOption && endedOption.textContent.includes('已结束')) {
                        // 找到了，停止监听并执行
                        observer.disconnect();
                        filterViewableCourses();
                        log('重试后找到"已结束"选项，已应用筛选');
                    } else if (retryCount < maxRetries) {
                        // 继续重试
                        setTimeout(retryDetection, retryInterval);
                    } else {
                        // 重试次数用完，停止监听并显示提示信息
                        observer.disconnect();
                        showTipMessage('先点击"已结束"筛选后再点击此处', button);
                        log(`重试${maxRetries}次后仍未检测到"已结束"选项被点击，显示提示信息`);
                    }
                };
                
                setTimeout(retryDetection, retryInterval);
                return;
            }
            
            // 应用筛选，只显示已结束且可查看内容的课程
            filterViewableCourses();
            log('已应用筛选');
        }
    }

    // 筛选已结束且可查看内容的课程
    function filterViewableCourses() {
        log('开始筛选已结束且可查看内容的课程');
        
        // 只在 _1GdAr 类的范围内进行筛选
        const mainContainer = document.querySelector('._1GdAr');
        if (!mainContainer) {
            log('未找到 _1GdAr 容器');
            return;
        }
        
        log('找到 _1GdAr 容器，开始筛选');
        
        // 在 _1GdAr 容器内查找所有包含"已结束"的元素
        const allElements = mainContainer.querySelectorAll('*');
        const courseContainers = new Set();
        
        allElements.forEach(element => {
            // 排除HTML、HEAD、SCRIPT、STYLE等标签
            const excludeTags = ['HTML', 'HEAD', 'SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE'];
            if (excludeTags.includes(element.tagName)) {
                return;
            }
            
            const text = element.textContent.trim();
            if (text.includes('已结束') && 
                !text.includes('display:') && 
                !text.includes('alignItems:') &&
                !text.includes('已结束可查看内容全部正在进行即将开始已结束国家精品课认证学习课程智慧课程') &&
                text.length < 1000) {
                
                // 向上查找课程容器
                let container = element;
                for (let i = 0; i < 5 && container && container.parentElement; i++) {
                    if (container.tagName === 'DIV') {
                        const containerText = container.textContent.trim();
                        // 更精确的课程容器识别条件
                        if (containerText.includes('已结束') && 
                            (containerText.includes('学院') || containerText.includes('大学') || containerText.includes('University')) &&
                            containerText.length > 50 && containerText.length < 1000 &&
                            !containerText.includes('智慧课程') &&
                            !containerText.includes('全部正在进行即将开始')) {
                            
                            // 检查是否已经添加过这个容器（避免重复）
                            let isDuplicate = false;
                            for (const existingContainer of courseContainers) {
                                if (existingContainer === container || 
                                    existingContainer.textContent.trim() === containerText) {
                                    isDuplicate = true;
                                    break;
                                }
                            }
                            
                            if (!isDuplicate) {
                                log(`找到课程容器: "${containerText.substring(0, 100)}..."`);
                                courseContainers.add(container);
                            }
                            break;
                        }
                    }
                    container = container.parentElement;
                }
            }
        });
        
        const courseItems = Array.from(courseContainers);
        
        if (courseItems.length === 0) {
            log('未找到任何课程元素');
            return;
        }

        log(`找到 ${courseItems.length} 个课程元素`);

        let visibleCount = 0;
        let hiddenCount = 0;

        courseItems.forEach((item, index) => {
            // 检查课程状态
            const statusText = getCourseStatus(item);
            const hasViewContent = hasViewContentButton(item);
            
            log(`课程 ${index + 1}: 状态="${statusText}", 有查看按钮=${hasViewContent}`);
            
            // 确保不修改筛选栏容器的样式
            if (item.classList.contains('_1Huf_') || item.textContent.includes('智慧课程')) {
                log('跳过筛选栏容器，避免影响布局');
                return;
            }
            
            if (statusText === '已结束' && hasViewContent) {
                // 已结束且有"可查看内容"按钮的课程
                // 只修改显示状态，不改变原有布局
                item.style.display = '';
                item.style.visibility = 'visible';
                item.style.position = '';
                item.style.left = '';
                item.classList.add('mooc-filtered-viewable');
                visibleCount++;
                log(`显示可查看课程: ${getCourseTitle(item)}`);
            } else if (statusText === '已结束') {
                // 已结束但没有"可查看内容"按钮的课程，也隐藏
                item.style.visibility = 'hidden';
                item.style.position = 'absolute';
                item.style.left = '-9999px';
                hiddenCount++;
            } else {
                // 隐藏其他课程，使用visibility而不是display来保持布局
                item.style.visibility = 'hidden';
                item.style.position = 'absolute';
                item.style.left = '-9999px';
                hiddenCount++;
            }
        });

        // 更新按钮文本，显示筛选数量和明显的❌
        const button = document.getElementById('mooc-filter-btn');
        if (button) {
            button.innerHTML = `已结束可查看 (${visibleCount}) <span style="display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; margin-left:8px; border-radius:3px; background: transparent; vertical-align: middle; line-height: 1;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                    <path d="M6 6l12 12M18 6L6 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </span>`;
            button.classList.add('active');
            // 互斥：禁用“结束无法查看”按钮
            const other = document.getElementById('mooc-clear-btn');
            if (other) {
                other.disabled = true;
                other.style.opacity = '0.6';
                other.style.pointerEvents = 'none';
            }
            // 激活颜色：深绿色
            button.style.background = '#388e3c';
            button.style.color = '#ffffff';
        }
        log(`筛选完成: 显示 ${visibleCount} 个可查看课程，隐藏 ${hiddenCount} 个其他课程`);
    }

    // 筛选已结束但无法查看的课程
    function filterUnviewableCourses() {
        log('开始筛选已结束但无法查看的课程');
        
        // 只在 _1GdAr 类的范围内进行筛选
        const mainContainer = document.querySelector('._1GdAr');
        if (!mainContainer) {
            log('未找到 _1GdAr 容器');
            return;
        }
        
        log('找到 _1GdAr 容器，开始筛选');
        
        // 在 _1GdAr 容器内查找所有包含"已结束"的元素
        const allElements = mainContainer.querySelectorAll('*');
        const courseContainers = new Set();
        
        allElements.forEach(element => {
            const excludeTags = ['HTML', 'HEAD', 'SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE'];
            if (excludeTags.includes(element.tagName)) {
                return;
            }
            
            const text = element.textContent.trim();
            if (text.includes('已结束') && 
                !text.includes('display:') && 
                !text.includes('alignItems:') &&
                !text.includes('已结束可查看内容全部正在进行即将开始已结束国家精品课认证学习课程智慧课程') &&
                text.length < 1000) {
                
                let container = element;
                for (let i = 0; i < 5 && container && container.parentElement; i++) {
                    if (container.tagName === 'DIV') {
                        const containerText = container.textContent.trim();
                        if (containerText.includes('已结束') && 
                            (containerText.includes('学院') || containerText.includes('大学') || containerText.includes('University')) &&
                            containerText.length > 50 && containerText.length < 1000 &&
                            !containerText.includes('智慧课程') &&
                            !containerText.includes('全部正在进行即将开始')) {
                            
                            let isDuplicate = false;
                            for (const existingContainer of courseContainers) {
                                if (existingContainer === container || 
                                    existingContainer.textContent.trim() === containerText) {
                                    isDuplicate = true;
                                    break;
                                }
                            }
                            
                            if (!isDuplicate) {
                                courseContainers.add(container);
                            }
                            break;
                        }
                    }
                    container = container.parentElement;
                }
            }
        });
        
        const courseItems = Array.from(courseContainers);
        
        if (courseItems.length === 0) {
            log('未找到任何课程元素');
            return;
        }

        log(`找到 ${courseItems.length} 个课程元素`);

        let visibleCount = 0;
        let hiddenCount = 0;

        courseItems.forEach((item, index) => {
            const statusText = getCourseStatus(item);
            const hasViewContent = hasViewContentButton(item);
            
            log(`课程 ${index + 1}: 状态="${statusText}", 有查看按钮=${hasViewContent}`);
            
            if (item.classList.contains('_1Huf_') || item.textContent.includes('智慧课程')) {
                log('跳过筛选栏容器，避免影响布局');
                return;
            }
            
            // 跳过推荐栏中的课程
            if (statusText === '已结束' && !hasViewContent) {
                // 已结束但没有"可查看内容"按钮的课程
                item.style.display = '';
                item.style.visibility = 'visible';
                item.style.position = '';
                item.style.left = '';
                item.classList.add('mooc-filtered-unviewable');
                visibleCount++;
                log(`显示无法查看课程: ${getCourseTitle(item)}`);
            } else {
                // 隐藏其他课程
                item.style.visibility = 'hidden';
                item.style.position = 'absolute';
                item.style.left = '-9999px';
                hiddenCount++;
            }
        });

        // 更新按钮文本，显示筛选数量和明显的❌
        const button = document.getElementById('mooc-clear-btn');
        if (button) {
            button.innerHTML = `结束无法查看 (${visibleCount}) <span style="display:inline-flex; align-items:center; justify-content:center; width:16px; height:16px; margin-left:8px; border-radius:3px; background: transparent; vertical-align: middle; line-height: 1;">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;">
                    <path d="M6 6l12 12M18 6L6 18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </span>`;
            button.classList.add('active');
            // 互斥：禁用“已结束可查看”按钮
            const other = document.getElementById('mooc-filter-btn');
            if (other) {
                other.disabled = true;
                other.style.opacity = '0.6';
                other.style.pointerEvents = 'none';
            }
            // 激活颜色：深绿色
            button.style.background = '#388e3c';
            button.style.color = '#ffffff';
        }
        log(`筛选完成: 显示 ${visibleCount} 个无法查看课程，隐藏 ${hiddenCount} 个其他课程`);
    }

    // 显示所有已结束课程
    function showAllEndedCourses() {
        log('显示所有已结束课程');
        
        // 只在 _1GdAr 类的范围内进行筛选
        const mainContainer = document.querySelector('._1GdAr');
        if (!mainContainer) {
            log('未找到 _1GdAr 容器');
            return;
        }
        
        log('找到 _1GdAr 容器，开始恢复显示');
        
        // 在 _1GdAr 容器内查找所有包含"已结束"的元素
        const allElements = mainContainer.querySelectorAll('*');
        const courseContainers = new Set();
        
        allElements.forEach(element => {
            const excludeTags = ['HTML', 'HEAD', 'SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE'];
            if (excludeTags.includes(element.tagName)) {
                return;
            }
            
            const text = element.textContent.trim();
            if (text.includes('已结束') && 
                !text.includes('display:') && 
                !text.includes('alignItems:') &&
                text.length < 1000) {
                
                let container = element;
                for (let i = 0; i < 5 && container && container.parentElement; i++) {
                    if (container.tagName === 'DIV') {
                        const containerText = container.textContent.trim();
                        if (containerText.includes('人参加') || 
                            (containerText.includes('课程') && containerText.includes('已结束')) ||
                            (containerText.includes('大学') && containerText.includes('教授')) ||
                            (containerText.includes('已结束') && containerText.length > 10 && containerText.length < 500)) {
                            courseContainers.add(container);
                            break;
                        }
                    }
                    container = container.parentElement;
                }
            }
        });
        
        const courseItems = Array.from(courseContainers);

        courseItems.forEach(item => {
            const statusText = getCourseStatus(item);
            
            // 确保不修改筛选栏容器的样式
            if (item.classList.contains('_1Huf_') || item.textContent.includes('智慧课程')) {
                log('跳过筛选栏容器，避免影响布局');
                return;
            }
            
            if (statusText === '已结束') {
                // 恢复显示，清除所有筛选相关的样式
                item.style.visibility = '';
                item.style.position = '';
                item.style.left = '';
                item.style.display = '';
                item.classList.remove('mooc-filtered-viewable');
                item.classList.remove('mooc-filtered-unviewable');
            }
        });
        
        // 额外清理：确保所有隐藏的元素都被恢复显示
        log('额外清理：恢复所有隐藏的课程元素');
        const allHiddenElements = document.querySelectorAll('*');
        allHiddenElements.forEach(element => {
            if (element.style.visibility === 'hidden' || 
                element.style.position === 'absolute' || 
                element.style.left === '-9999px') {
                
                // 检查是否是课程相关元素
                const text = element.textContent.trim();
                if (text.includes('已结束') && text.length > 10 && text.length < 500) {
                    log(`恢复隐藏的课程元素: "${text.substring(0, 50)}..."`);
                    element.style.visibility = '';
                    element.style.position = '';
                    element.style.left = '';
                    element.style.display = '';
                    element.classList.remove('mooc-filtered-viewable');
                    element.classList.remove('mooc-filtered-unviewable');
                }
            }
        });

        // 清除筛选数量显示
        const button = document.getElementById('mooc-filter-btn');
        if (button) {
            button.innerHTML = '已结束可查看 <span id="filter-count"></span>';
            button.classList.remove('active');
            button.style.background = '#a5d6a7';
            // 确保可点击
            button.disabled = false;
            button.style.opacity = '';
            button.style.pointerEvents = '';
            button.style.color = '#000000';
            // 互斥恢复：启用“结束无法查看”按钮
            const other = document.getElementById('mooc-clear-btn');
            if (other) {
                other.disabled = false;
                other.style.opacity = '';
                other.style.pointerEvents = '';
            }
        }
        
        // 重置"结束无法查看"按钮状态
        const clearButton = document.getElementById('mooc-clear-btn');
        if (clearButton) {
            clearButton.innerHTML = '结束无法查看';
            clearButton.classList.remove('active');
            clearButton.style.background = '#a5d6a7';
            // 确保可点击
            clearButton.disabled = false;
            clearButton.style.opacity = '';
            clearButton.style.pointerEvents = '';
            clearButton.style.color = '#000000';
        }
        
        hideFilterResult();
    }

    // 显示提示信息
    function showTipMessage(message, targetElement) {
        // 移除已存在的提示
        const existingTip = document.getElementById('mooc-tip-message');
        if (existingTip) {
            existingTip.remove();
        }
        
        // 创建提示元素
        const tipElement = document.createElement('div');
        tipElement.id = 'mooc-tip-message';
        tipElement.textContent = message;
        tipElement.style.cssText = `
            position: absolute;
            background: #ff6b6b;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            z-index: 10001;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            white-space: nowrap;
            pointer-events: none;
            animation: tipFadeIn 0.3s ease;
        `;
        
        // 添加动画样式
        if (!document.getElementById('mooc-tip-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'mooc-tip-styles';
            styleElement.textContent = `
                @keyframes tipFadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(styleElement);
        }
        
        // 计算位置（显示在按钮上方）
        const rect = targetElement.getBoundingClientRect();
        tipElement.style.left = rect.left + 'px';
        tipElement.style.top = (rect.top - 40) + 'px';
        
        // 添加到页面
        document.body.appendChild(tipElement);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (tipElement.parentNode) {
                tipElement.remove();
            }
        }, 3000);
    }

    // 获取课程标题
    function getCourseTitle(courseElement) {
        const titleSelectors = [
            '.course-title',
            '.course-name',
            '.title',
            'h3',
            'h4',
            '[class*="title"]',
            '[class*="name"]'
        ];

        for (const selector of titleSelectors) {
            const element = courseElement.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }

        return '未知课程';
    }



    // 获取课程状态文本
    function getCourseStatus(courseElement) {
        const statusSelectors = [
            '.course-status',
            '.status',
            '.course-card-status',
            '[class*="status"]',
            '.course-info span',
            '.status-text',
            '.course-state',
            '.state'
        ];

        for (const selector of statusSelectors) {
            const statusElement = courseElement.querySelector(selector);
            if (statusElement) {
                const text = statusElement.textContent.trim();
                if (text.includes('已结束')) {
                    return '已结束';
                }
            }
        }

        const fullText = courseElement.textContent;
        if (fullText.includes('已结束')) {
            return '已结束';
        }

        return '';
    }

    // 检查是否有"可查看内容"按钮
    function hasViewContentButton(courseElement) {
        // 直接检查整个容器的文本内容
        const fullText = courseElement.textContent.trim();
        
        // 检查是否包含"可查看内容"文本（排除描述中的"课程概述查看内容"）
        if (fullText.includes('可查看内容') && !fullText.includes('课程概述查看内容')) {
            log(`找到"可查看内容"文本: "${fullText.substring(0, 100)}..."`);
            return true;
        }
        
        // 检查是否包含其他可查看的按钮文本
        const viewButtonTexts = ['查看内容', '立即学习', '进入学习', '开始学习', '查看课程'];
        for (const buttonText of viewButtonTexts) {
            if (fullText.includes(buttonText) && !fullText.includes('课程概述查看内容')) {
                log(`找到"${buttonText}"文本: "${fullText.substring(0, 100)}..."`);
                return true;
            }
        }
        
        // 如果没有找到，记录详细信息用于调试
        log(`未找到可查看按钮，容器文本: "${fullText.substring(0, 200)}..."`);
        return false;
    }

    // 显示筛选结果统计
    function showFilterResult(visibleCount, hiddenCount) {
        let resultDiv = document.getElementById('mooc-filter-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'mooc-filter-result';
            resultDiv.className = 'mooc-filter-result';
        }

        resultDiv.innerHTML = `
            <span class="filter-stats">
                📊 显示 ${visibleCount} 个可查看课程，隐藏 ${hiddenCount} 个其他课程
            </span>
            <button class="clear-filter" onclick="document.getElementById('mooc-filter-btn').click()">
                结束无法查看
            </button>
        `;

        const button = document.getElementById('mooc-filter-btn');
        if (button && button.parentNode) {
            button.parentNode.insertBefore(resultDiv, button.nextSibling);
        }
    }

    // 隐藏筛选结果
    function hideFilterResult() {
        const resultDiv = document.getElementById('mooc-filter-result');
        if (resultDiv) {
            resultDiv.remove();
        }
    }

    // 查找合适的插入位置
    function findInsertPosition() {
        // 优先查找_1Huf_容器（包含"智慧课程"的容器）
        const zhihuiContainer = document.querySelector('._1Huf_');
        if (zhihuiContainer && zhihuiContainer.textContent.includes('智慧课程')) {
            log(`找到_1Huf_容器，包含"智慧课程": ${zhihuiContainer.tagName}.${zhihuiContainer.className}`);
            log(`容器子元素数量: ${zhihuiContainer.children.length}`);
            return zhihuiContainer;
        }

        // 如果没找到_1Huf_容器，尝试查找包含"智慧课程"的元素
        const allElements = document.querySelectorAll('*');
        for (const element of allElements) {
            if (element.textContent.trim() === '智慧课程') {
                log(`找到"智慧课程"元素: ${element.tagName}.${element.className}`);
                
                // 向上查找合适的容器
                let container = element;
                for (let i = 0; i < 5; i++) {
                    if (container && container.tagName === 'DIV' && container.children.length > 1) {
                        log(`使用容器: ${container.tagName}.${container.className}, 子元素数量: ${container.children.length}`);
                        return container;
                    }
                    container = container.parentElement;
                }
                
                // 如果没找到合适的容器，使用父元素
                log(`使用智慧课程父元素: ${element.parentElement.tagName}.${element.parentElement.className}`);
                return element.parentElement;
            }
        }

        // 如果没找到"智慧课程"，尝试找到包含"已结束"的元素
        for (const element of allElements) {
            if (element.textContent.includes('已结束')) {
                log(`找到包含"已结束"的元素，在其前面插入: ${element.tagName}.${element.className}`);
                return element.parentElement;
            }
        }

        // 尝试多个可能的插入位置
        const insertSelectors = [
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

        for (const selector of insertSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                log(`找到插入位置: ${selector}`);
                return element;
            }
        }

        log('未找到合适的插入位置，将在body开头插入');
        return document.body;
    }

    // 初始化插件
    function initPlugin() {
        log('开始初始化插件');
        
        if (document.getElementById('mooc-filter-btn')) {
            log('筛选按钮已存在，跳过初始化');
            return;
        }

        const insertPosition = findInsertPosition();
        log(`插入位置: ${insertPosition.tagName}.${insertPosition.className}`);
        
        if (insertPosition) {
            // 检查是否是_1Huf_容器，如果是则直接插入按钮
            if (insertPosition.classList.contains('_1Huf_')) {
                log('检测到_1Huf_容器，直接插入按钮');
                
                const button = createFilterButton();
                // 调整按钮样式为浅绿色（未激活）
                button.style.cssText = `
                    background: #a5d6a7;
                    color: #000000;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 10000;
                    min-width: 75px;
                    margin-left: 2px;
                    transition: all 0.2s ease;
                    display: inline-block;
                    vertical-align: middle;
                `;
                
                // 重新绑定点击事件（确保事件正确绑定）
                button.removeEventListener('click', toggleFilter);
                button.addEventListener('click', toggleFilter);
                
                // 取消动画悬停效果，保持稳重
                
                // 创建"结束无法查看"按钮
                const clearButton = document.createElement('button');
                clearButton.id = 'mooc-clear-btn';
                clearButton.className = 'mooc-filter-button';
                clearButton.innerHTML = '结束无法查看';
                // 去除鼠标悬停提示
                clearButton.style.cssText = `
                    background: #a5d6a7;
                    color: #000000;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                    font-size: 12px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 10000;
                    min-width: 75px;
                    margin-left: 4px;
                    transition: all 0.2s ease;
                    display: inline-block;
                    vertical-align: middle;
                `;
                
                // 添加点击事件
                clearButton.addEventListener('click', (event) => {
                    toggleUnviewableFilter(event);
                });
                
                // 取消动画悬停效果，保持稳重
                
                // 将两个按钮作为“智慧课程”容器的下一个兄弟节点（独立一行）
                const existingRow = document.getElementById('mooc-custom-filter-row');
                if (existingRow && existingRow.parentNode) {
                    existingRow.parentNode.removeChild(existingRow);
                }

                const customButtonsRow = document.createElement('div');
                customButtonsRow.id = 'mooc-custom-filter-row';
                customButtonsRow.style.cssText = `
                    width: 100%;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 6px;
                    flex-wrap: wrap;
                `;
                customButtonsRow.appendChild(button);
                customButtonsRow.appendChild(clearButton);

                const parent = insertPosition.parentElement || document.body;
                if (insertPosition.nextSibling) {
                    parent.insertBefore(customButtonsRow, insertPosition.nextSibling);
                } else {
                    parent.appendChild(customButtonsRow);
                }
                log('✅ 按钮已作为兄弟节点插入到_1Huf_容器下一行');
            } else {
                // 其他容器使用原来的容器方式
                log('使用容器方式插入');
                
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

                const button = createFilterButton();
                filterContainer.appendChild(button);

                // 插入到DOM中
                if (insertPosition === document.body) {
                    const firstContentElement = document.querySelector('header, nav, .header, .nav, .banner, .top');
                    if (firstContentElement && firstContentElement.nextSibling) {
                        insertPosition.insertBefore(filterContainer, firstContentElement.nextSibling);
                        log('插入到body中，在第一个内容元素之后');
                    } else {
                        insertPosition.insertBefore(filterContainer, insertPosition.firstChild);
                        log('插入到body开头');
                    }
                } else {
                    insertPosition.insertBefore(filterContainer, insertPosition.firstChild);
                    log(`插入到容器 ${insertPosition.tagName}.${insertPosition.className} 的开头`);
                }
            }

            // 验证按钮是否成功插入
            setTimeout(() => {
                const insertedButton = document.getElementById('mooc-filter-btn');
                if (insertedButton && insertedButton.offsetParent) {
                    log('✅ 按钮成功插入到DOM中');
                    log(`按钮位置: ${insertedButton.offsetLeft}, ${insertedButton.offsetTop}`);
                } else {
                    log('❌ 按钮插入失败');
                }
            }, 100);

            log('插件初始化完成');
        } else {
            log('无法找到插入位置');
        }
    }

    // 监听页面变化
    function observePageChanges() {
        let currentUrl = window.location.href;
        let currentPageContent = '';
        
        // 监听URL变化
        const urlObserver = new MutationObserver(() => {
            if (window.location.href !== currentUrl) {
                log('检测到URL变化，重置筛选状态');
                currentUrl = window.location.href;
                resetFilterState();
            }
        });
        
        // 监听页面内容变化
        const contentObserver = new MutationObserver((mutations) => {
            let shouldReinit = false;
            let shouldResetFilter = false;
            let newPageContent = '';
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // 检查是否是课程相关元素
                            const courseSelectors = [
                                '.course-card',
                                '.course-item',
                                '.course-list-item',
                                '[class*="course"]'
                            ];
                            
                            for (const selector of courseSelectors) {
                                if (node.classList.contains(selector.replace('.', '')) || 
                                    node.querySelector(selector)) {
                                    shouldReinit = true;
                                    shouldResetFilter = true;
                                    break;
                                }
                            }
                            
                            // 检查是否是分页元素
                            if (node.textContent && (
                                node.textContent.includes('下一页') || 
                                node.textContent.includes('上一页') ||
                                node.textContent.includes('分页') ||
                                node.textContent.includes('第') && node.textContent.includes('页') ||
                                node.querySelector && node.querySelector('[class*="pagination"]')
                            )) {
                                shouldResetFilter = true;
                            }
                            
                            // 收集页面内容用于检测变化
                            newPageContent += node.textContent || '';
                        }
                    });
                }
            });

            // 检查页面内容是否发生重大变化
            if (newPageContent && newPageContent !== currentPageContent) {
                const contentChangeThreshold = 100; // 内容变化阈值
                if (Math.abs(newPageContent.length - currentPageContent.length) > contentChangeThreshold) {
                    log('检测到页面内容重大变化，重置筛选状态');
                    currentPageContent = newPageContent;
                    shouldResetFilter = true;
                }
            }
            
            // 检查分页状态变化
            const currentPaginationState = detectPaginationChange();
            if (window.lastPaginationState && 
                (currentPaginationState.currentPage !== window.lastPaginationState.currentPage ||
                 currentPaginationState.pageText !== window.lastPaginationState.pageText)) {
                log('检测到分页变化，重置筛选状态');
                window.lastPaginationState = currentPaginationState;
                shouldResetFilter = true;
            }

            if (shouldResetFilter) {
                log('检测到页面变化，重置筛选状态');
                resetFilterState();
                
                // 主动执行清除筛选操作，确保显示所有课程
                setTimeout(() => {
                    log('执行清除筛选操作');
                    showAllEndedCourses();
                }, 100);
            }
            
            if (shouldReinit) {
                log('检测到页面变化，重新初始化');
                setTimeout(initPlugin, 500);
            }
        });

        // 监听URL变化
        urlObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 监听页面内容变化
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 监听浏览器前进后退
        window.addEventListener('popstate', () => {
            log('检测到浏览器导航，重置筛选状态');
            setTimeout(() => {
                resetFilterState();
                showAllEndedCourses();
            }, 100);
        });
        
        // 监听页面卸载
        window.addEventListener('beforeunload', () => {
            log('页面即将卸载，清理状态');
            resetFilterState();
        });
        
        // 监听分页按钮点击
        document.addEventListener('click', (event) => {
            const target = event.target;
            const text = target.textContent || '';
            
            // 检查是否是分页按钮
            if (text.includes('下一页') || 
                text.includes('上一页') || 
                text.includes('第') && text.includes('页') ||
                target.closest('[class*="pagination"]') ||
                target.closest('[class*="分页"]')) {
                
                log('检测到分页按钮点击，准备重置筛选状态');
                setTimeout(() => {
                    resetFilterState();
                    showAllEndedCourses();
                }, 200);
            }
        });
    }
    
    // 重置筛选状态
    function resetFilterState() {
        log('重置筛选状态');
        
        // 重置主筛选按钮状态
        const button = document.getElementById('mooc-filter-btn');
        if (button) {
            button.innerHTML = '已结束可查看 <span id="filter-count"></span>';
            button.classList.remove('active');
            button.style.background = '#a5d6a7';
        }
        
        // 重置清除按钮状态
        const clearButton = document.getElementById('mooc-clear-btn');
        if (clearButton) {
            clearButton.innerHTML = '结束无法查看';
        }
        
        // 清除所有筛选样式 - 更全面的清理
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            // 清除所有可能的筛选相关样式
            if (element.style.visibility === 'hidden' || 
                element.style.position === 'absolute' || 
                element.style.left === '-9999px' ||
                element.classList.contains('mooc-filtered-viewable') ||
                element.classList.contains('mooc-filtered-unviewable')) {
                
                element.style.visibility = '';
                element.style.position = '';
                element.style.left = '';
                element.style.display = '';
                element.classList.remove('mooc-filtered-viewable');
                element.classList.remove('mooc-filtered-unviewable');
            }
        });
        
        // 隐藏筛选结果显示
        hideFilterResult();
        
        // 清除可能存在的筛选结果容器
        const resultDiv = document.getElementById('mooc-filter-result');
        if (resultDiv) {
            resultDiv.remove();
        }
        
        log('筛选状态已完全重置');
    }

    // 检测分页变化
    function detectPaginationChange() {
        // 检查URL中的页码参数
        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page') || urlParams.get('p') || '1';
        
        // 检查页面中的分页信息
        const pageInfo = document.querySelector('[class*="pagination"], [class*="page"], [class*="分页"]');
        const pageText = pageInfo ? pageInfo.textContent : '';
        
        return {
            currentPage: currentPage,
            pageText: pageText,
            hasPagination: !!pageInfo
        };
    }
    
    // 页面加载完成后初始化
    function startPlugin() {
        log('开始启动插件');
        
        // 记录初始分页状态
        window.lastPaginationState = detectPaginationChange();
        
        setTimeout(() => {
            initPlugin();
            observePageChanges();
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startPlugin);
    } else {
        startPlugin();
    }

    // 监听URL变化
    let currentUrl = location.href;
    setInterval(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            log('URL变化，重新初始化');
            setTimeout(initPlugin, 1000);
        }
    }, 1000);

    // 添加全局函数，方便调试
    window.moocFilter = {
        init: initPlugin,
        filter: filterViewableCourses,
        showAll: showAllEndedCourses,
        debug: () => {
            console.log('当前页面课程元素:', document.querySelectorAll('[class*="course"]'));
            console.log('筛选按钮:', document.getElementById('mooc-filter-btn'));
        }
    };

    log('插件加载完成，可以使用 window.moocFilter.debug() 进行调试');

})();
