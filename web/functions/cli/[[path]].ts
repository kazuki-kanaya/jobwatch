type Env = {
  API_ORIGIN: string;
};

type OnRequestContext = {
  request: Request;
  env: Env;
  params: {
    path?: string | string[];
  };
};

export const onRequest = async ({ request, env, params }: OnRequestContext) => {
  if (!env.API_ORIGIN) {
    return new Response("API_ORIGIN is not set", { status: 500 });
  }

  const incoming = new URL(request.url);
  const origin = new URL(env.API_ORIGIN);
  const rawPath = params.path;
  const path = Array.isArray(rawPath) ? rawPath.join("/") : (rawPath ?? "");
  const segments = path.split("/").filter((segment) => segment.length > 0 && segment !== ".");
  if (segments.some((segment) => segment === "..")) {
    return new Response("Invalid path", { status: 400 });
  }
  const safePath = segments.join("/");

  const basePath = origin.pathname.replace(/\/+$/, "");
  origin.pathname = `${basePath}/cli/${safePath}`.replace(/\/{2,}/g, "/");
  origin.search = incoming.search;

  const allowedHeaders = ["authorization", "content-type", "accept", "user-agent"];
  const forwardedHeaders = new Headers();
  for (const name of allowedHeaders) {
    const value = request.headers.get(name);
    if (value) forwardedHeaders.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const proxiedRequest = new Request(origin.toString(), {
    method: request.method,
    headers: forwardedHeaders,
    body: hasBody ? request.body : undefined,
  });

  return fetch(proxiedRequest, { redirect: "manual" });
};
