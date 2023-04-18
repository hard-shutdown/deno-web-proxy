import { serve } from "https://deno.land/std@0.183.0/http/server.ts";

import { Rewriter, setUrlToProxy } from "./rewriter.ts"
import { stripHeaders, overrideHeaders } from "./headerUtils.ts";

serve(async (req: Request) => {
    if (req.url.includes("/__inject.js")) {
        const data = await Deno.readFile("./in-page/inject.js")
        return new Response(data, {
            headers: {
                "content-type": "application/javascript",
            },
            status: 200,
        });
    } else if (req.url.includes("/__sw.js")) {
        const data = await Deno.readFile("./in-page/sw.js")
        return new Response(data, {
            headers: {
                "content-type": "application/javascript",
            },
            status: 200,
        });
    }


    const urlToProxy = decodeURIComponent(new URL(req.url).searchParams.get("url")?.toString() || "");
    if (urlToProxy == "") return new Response("No url provided", { status: 400 });

    const response = await fetch(urlToProxy, {
        method: req.method,
        headers: stripHeaders(req.headers, ["host", "origin", "referer"]),
    });
    const contentType = await response.headers.get("content-type");

    if (contentType?.startsWith("text/html")) {
        setUrlToProxy(urlToProxy);
        return new Response(await Rewriter.transform(response).text(), {
            headers: overrideHeaders(stripHeaders(response.headers, ["content-security-policy"]), {
                "access-control-allow-origin": "*",
                "x-frame-options": "*",
            }),
            status: response.status,
        });
    } else {
        return new Response(await response.arrayBuffer(), {
            headers: overrideHeaders(response.headers, {
                "access-control-allow-origin": "*",
                "x-frame-options": "*",
            }),
            status: response.status,
        });
    }

});
