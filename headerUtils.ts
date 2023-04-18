export const stripHeaders = (headers: Headers, keys: string[]) => {
    const mutableHeaders = new Headers();
    headers.forEach((value, key) => mutableHeaders.set(key, value));
    for (const key of keys) {
        mutableHeaders.delete(key);
    }
    return mutableHeaders;
}

export const overrideHeaders = (headers: Headers, overrides: Record<string, string>) => {
    const mutableHeaders = new Headers();
    headers.forEach((value, key) => mutableHeaders.set(key, value));
    for (const key in overrides) {
        mutableHeaders.set(key, overrides[key]);
    }
    return mutableHeaders;
}