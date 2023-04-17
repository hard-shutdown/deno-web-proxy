import { serve } from "https://deno.land/std@0.183.0/http/server.ts";
import { 
    HTMLRewriter 
} from 'https://ghuc.cc/worker-tools/html-rewriter/index.ts'

const encodeProperPath = (path: string, baseUrl: string) => {
    const url = new URL(path, baseUrl);
    return encodeURIComponent(url.href);
}


serve(async (req: Request) => {

    const urlToProxy = decodeURIComponent(new URL(req.url).searchParams.get("url")?.toString() || "");
    if (urlToProxy == "") return new Response("No url provided", { status: 400 });

    const rewriter = new HTMLRewriter()
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

    const response = await fetch(urlToProxy);
    const contentType = await response.headers.get("content-type");

    if (contentType?.startsWith("text/html")) {
        return new Response(await rewriter.transform(response).text(), {
            headers: {
                "content-type": "text/html; charset=utf-8",
                ...response.headers,
                "access-control-allow-origin": "*",
                "x-frame-options": "*",
            },
            status: response.status,
        });
    } else {
        return new Response(await response.arrayBuffer(), {
            headers: {
                "content-type": contentType || "application/octet-stream",
                ...response.headers,
                "access-control-allow-origin": "*",
                "x-frame-options": "*",
            },
            status: response.status,
        });
    }

});
