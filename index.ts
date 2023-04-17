import { serve } from "https://deno.land/std@0.183.0/http/server.ts";

import { Rewriter } from "./rewriter.ts"

serve(async (req: Request) => {

    const urlToProxy = decodeURIComponent(new URL(req.url).searchParams.get("url")?.toString() || "");
    if (urlToProxy == "") return new Response("No url provided", { status: 400 });

    const response = await fetch(urlToProxy);
    const contentType = await response.headers.get("content-type");

    if (contentType?.startsWith("text/html")) {
        return new Response(await Rewriter.transform(response).text(), {
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
