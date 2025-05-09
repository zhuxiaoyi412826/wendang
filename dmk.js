// 代码框
// 引入 highlight.js 并配置 marked 的 renderer
if (typeof window.hljs === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/lib/common.min.js';
    script.onload = () => {
        marked.setOptions({
            highlight: function(code, lang) {
                if (window.hljs && lang && window.hljs.getLanguage(lang)) {
                    return window.hljs.highlight(code, { language: lang }).value;
                }
                return window.hljs ? window.hljs.highlightAuto(code).value : code;
            },
            langPrefix: 'hljs language-',
            gfm: true,
            breaks: true,
            renderer: (() => {
                const renderer = new marked.Renderer();
                renderer.code = function(code, infostring, escaped) {
                    const lang = (infostring || '').split(/\s+/)[0];
                    const language = 'text'; // 将语言标识符替换为'text'
                    const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
                    let codeStr = code;
                    if (typeof code === 'object' && code !== null) {
                        if ('raw' in code) {
                            codeStr = code.raw;
                        } else {
                            codeStr = JSON.stringify(code, null, 2);
                        }
                    }
                    if (typeof codeStr !== 'string') {
                        codeStr = String(codeStr);
                    }
                    codeStr = codeStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const lines = codeStr.split('\n');
                    const lineNumberHtml = lines.map((_, i) => `<span class=\"code-linenumber\">${i + 1}</span>`).join('');
                    const codeLinesHtml = lines.map(line => `<span class=\"code-line\">${line === undefined || line === '' ? '&nbsp;' : line}</span>`).join('');
                    const brightnessBtn = `<button class=\"code-brightness-btn\" data-target=\"${codeId}\" title=\"亮度\">🌙</button>`;
                    return `\n<div class=\"custom-code-block\">\n  <div class=\"code-block-body\">\n    <div class=\"code-linenumbers\">${lineNumberHtml}</div>\n    <pre class=\"hljs\"><code id=\"${codeId}\" class=\"hljs language-${language}\">${codeLinesHtml}</code></pre>\n  </div>\n  <div class=\"code-toolbar\">\n    <span class=\"code-lang\">${language}</span>\n    <div class=\"code-toolbar-btns\">${brightnessBtn}<button class=\"code-copy-btn\" data-target=\"${codeId}\" title=\"复制\">复制</button><button class=\"code-fullscreen-btn\" data-target=\"${codeId}\" title=\"全屏\">全屏</button></div>\n  </div>\n</div>\n`;
                };
                return renderer;
            })()
        });
        // 亮度按钮逻辑
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('code-brightness-btn')) {
                const btn = e.target;
                const codeBlock = btn.closest('.custom-code-block');
                if (codeBlock) {
                    codeBlock.classList.toggle('light-theme');
                    if (codeBlock.classList.contains('light-theme')) {
                        btn.innerHTML = '☀️';
                    } else {
                        btn.innerHTML = '🌙';
                    }
                }
            }
        });
    };
    document.head.appendChild(script);
    // 加载 highlight.js 的样式
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css';
    document.head.appendChild(link);
} else {
    marked.setOptions({
        highlight: function(code, lang) {
            if (window.hljs && lang && window.hljs.getLanguage(lang)) {
                return window.hljs.highlight(code, { language: lang }).value;
            }
            return window.hljs ? window.hljs.highlightAuto(code).value : code;
        },
        langPrefix: 'hljs language-',
        gfm: true,
        breaks: true,
        renderer: (() => {
            const renderer = new marked.Renderer();
            renderer.code = function(code, infostring, escaped) {
                const lang = (infostring || '').split(/\s+/)[0];
                const language = 'text';
                const codeId = 'code-' + Math.random().toString(36).substr(2, 9);
                let codeStr = code;
                if (typeof code !== 'string') {
                    try {
                        codeStr = JSON.stringify(code, null, 2);
                    } catch (e) {
                        codeStr = String(code);
                    }
                }
                codeStr = codeStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const lines = codeStr.split('\n');
                const lineNumberHtml = lines.map((_, i) => `<span class=\"code-linenumber\">${i + 1}</span>`).join('');
                const codeLinesHtml = lines.map(line => `<span class=\"code-line\">${line === undefined || line === '' ? '&nbsp;' : line}</span>`).join('');
                const brightnessBtn = `<button class=\"code-brightness-btn\" data-target=\"${codeId}\" title=\"亮度\">🌙</button>`;
                return `\n<div class=\"custom-code-block\">\n  <div class=\"code-block-body\">\n   
                 <div class=\"code-linenumbers\">${lineNumberHtml}</div>\n    <pre class=\"hljs\"><code id=\"${codeId}\" class=\"hljs language-${language}\">${codeLinesHtml}</code></pre>\n 
                  </div>\n  <div class=\"code-toolbar\">\n    <span class=\"code-lang\">${language}</span>\n  
                    <div class=\"code-toolbar-btns\">${brightnessBtn}<button class=\"code-copy-btn\" data-target=\"${codeId}\" title=\"复制\">复制</button>
                    <button class=\"code-fullscreen-btn\" data-target=\"${codeId}\" title=\"全屏\">全屏</button></div>\n  </div>\n</div>\n`;
            };
            return renderer;
        })()
    });

    
    // 代码块亮度按钮逻辑
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('code-brightness-btn')) {
            const btn = e.target;
            const codeBlock = btn.closest('.custom-code-block');
            if (codeBlock) {
                codeBlock.classList.toggle('light-theme');
                if (codeBlock.classList.contains('light-theme')) {
                    btn.innerHTML = '☀️';
                } else {
                    btn.innerHTML = '🌙';
                }
            }
        }
    });
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