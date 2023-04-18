import { 
    HTMLRewriter 
} from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'

var urlToProxy = '';

export const setUrlToProxy = (url: string) => { urlToProxy = url }

export const encodeProperPath = (path: string, baseUrl: string) => {
    const url = new URL(path, baseUrl);
    return encodeURIComponent(url.href);
}

export const Rewriter = new HTMLRewriter()
        .on("head", {
            element(element) {
                element.prepend(`<script src="/__inject.js"></script>`, { html: true });
            }
        })
        .on("*[href]", {
            element(element) {
                const href = element.getAttribute("href");
                if (href) {
                    element.setAttribute("href", `/?url=${encodeProperPath(href, urlToProxy)}`);
                }
            }
        })
        .on("*[src]", {
            element(element) {
                const src = element.getAttribute("src");
                if (src) {
                    element.setAttribute("src", `/?url=${encodeProperPath(src, urlToProxy)}`);
                }
            }
        })
        .on("*[srcset]", {
            element(element) {
                const srcset = element.getAttribute("srcset");
                if (srcset) {
                    element.removeAttribute("srcset");
                }
            }
        })
        .on("form", {
            element(element) {
                const action = element.getAttribute("action");
                if (action) {
                    element.setAttribute("action", `/?url=${encodeProperPath(action, urlToProxy)}`);
                }
            }
        });