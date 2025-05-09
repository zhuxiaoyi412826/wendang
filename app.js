// 使用全局的marked
const { marked } = window;
const { createApp, ref, computed } = Vue;

// 获取resources目录下的markdown文件列表
async function getMarkdownFiles() {
    try {
        // 这里假设resources目录下有固定的几个markdown文件
        // 实际项目中可以通过API或文件系统API获取真实文件列表
        return [
            '0javaweb技术栈.md',
            '1HTMLCSS.md',
            '2javaScript.md',
            '3XML-Tomcat-HTTP.md',
            '4serverlet.md',
            '5会话过滤器监听器.md',
            '6前端工程化.md',
            '7SpringMVC.md',
            '8Mybatis.md',
        ];
    } catch (error) {
        console.error('获取文件列表失败:', error);
        return [];
    }
}

// 加载markdown文件内容
async function loadMarkdownContent(filename) {
    try {
        const response = await fetch(`./resources/${filename}`);
        if (!response.ok) throw new Error('文件加载失败');
        return await response.text();
    } catch (error) {
        console.error(`加载文件 ${filename} 失败:`, error);
        return `# 加载失败\n无法加载文件: ${filename}`;
    }
}

// 全局亮度状态
const isDarkMode = ref(false);


// 亮度调节功能
document.addEventListener('DOMContentLoaded', () => {
    const brightnessBtn = document.querySelector('.brightness-toggle');
    
    if (brightnessBtn) {
        brightnessBtn.addEventListener('click', () => {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            console.log('亮度按钮被点击，当前模式:', isDarkMode ? '暗色' : '亮色');
            brightnessBtn.innerHTML = isDarkMode ? '🌙' : '☀️';
        });
    } else {
        console.error('未找到亮度调节按钮');
    }
    // 代码块复制和全屏功能
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('code-copy-btn')) {
            const codeId = e.target.getAttribute('data-target');
            const codeElem = document.getElementById(codeId);
            if (codeElem) {
                const text = codeElem.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    e.target.innerText = '已复制';
                    setTimeout(() => { e.target.innerText = '复制'; }, 1200);
                });
            }
        } else if (e.target.classList.contains('code-fullscreen-btn')) {
            const codeId = e.target.getAttribute('data-target');
            const codeElem = document.getElementById(codeId);
            if (codeElem) {
                const pre = codeElem.closest('pre');
                if (pre.requestFullscreen) {
                    pre.requestFullscreen();
                } else if (pre.webkitRequestFullscreen) {
                    pre.webkitRequestFullscreen();
                } else if (pre.mozRequestFullScreen) {
                    pre.mozRequestFullScreen();
                } else if (pre.msRequestFullscreen) {
                    pre.msRequestFullscreen();
                }
            }
        }
        
    });
});


createApp({
    template: `
        <div class="container" :class="{ 'dark-mode': isDarkMode }">
            <div class="article-list">
                <h3>文章列表</h3>
                <div v-if="loading" class="loading">加载中...</div>
                <ul v-else>
                    <li v-for="article in articles" 
                        :key="article.id" 
                        @click="selectArticle(article)"
                        :class="{ active: selectedArticle?.id === article.id }">
                        {{ article.title }}
                    </li>
                </ul>
                <div v-if="error" class="error">{{ error }}</div>
            </div>
            <div class="article-content">
                <div v-if="!selectedArticle" class="placeholder">请选择一篇文章</div>
                <div v-else v-html="compiledMarkdown"></div>
            </div>
            <div class="outline">
                <h3>大纲</h3>
                <div v-if="outline.length === 0">无可用大纲</div>
                <ul v-else>
                    <li v-for="(item, index) in outline" 
                        :key="index" 
                        :style="{ paddingLeft: (item.level * 10) + 'px' }"
                        @click="scrollToHeading(item.text)">
                        {{ item.text }}
                    </li>
                </ul>
            </div>
        </div>
    `,
    setup() {
        const articles = ref([]);
        const selectedArticle = ref(null);
        const loading = ref(true);
        const error = ref(null);

        // 加载所有文章
        async function loadArticles() {
            try {
                loading.value = true;
                const files = await getMarkdownFiles();
                const loadedArticles = await Promise.all(
                    files.map(async (file, index) => {
                        const content = await loadMarkdownContent(file);
                        return {
                            id: index + 1,
                            title: file.replace('.md', ''),
                            filename: file,
                            content: content
                        };
                    })
                );
                articles.value = loadedArticles;
                if (loadedArticles.length > 0) {
                    selectArticle(loadedArticles[0]);
                }
            } catch (err) {
                error.value = '加载文章列表失败: ' + err.message;
            } finally {
                loading.value = false;
            }
        }

        // 选择文章
        function selectArticle(article) {
            selectedArticle.value = article;
        }

        // 解析markdown为HTML
        const compiledMarkdown = computed(() => {
            if (!selectedArticle.value) return '';
            return marked.parse(selectedArticle.value.content);
        });

        // 生成大纲
        const outline = computed(() => {
            if (!selectedArticle.value) return [];
            const lines = selectedArticle.value.content.split('\n');
            return lines
                .filter(line => line.startsWith('#'))
                .map(line => ({
                    level: line.match(/#/g)?.length || 1,
                    text: line.replace(/#/g, '').trim()
                }));
        });

        // 滚动到大纲对应的标题
        function scrollToHeading(text) {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const target = Array.from(headings).find(
                h => h.textContent.trim() === text
            );
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }

        // 初始化加载文章
        loadArticles();

        return {
            isDarkMode,
            articles,
            selectedArticle,
            loading,
            error,
            compiledMarkdown,
            outline,
            selectArticle,
            scrollToHeading
        };
    }
}).mount('#app');


