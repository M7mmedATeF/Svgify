/**
 * Simple Cache Storage wrapper for SVG icons.
 * Provides get, set and cleanup with configurable limits.
 */
export const CACHE_NAME = 'svgify-cache';
export const MAX_CACHE_ENTRIES = 50; // maximum number of cached icons
export const MAX_CACHE_AGE_MS = 24 * 60 * 60 * 1000; // 24h

/** Get cached SVG string for a key */
export async function getCachedSvg(key: string): Promise<string | null> {
    const cache = await caches.open(CACHE_NAME);
    const response = await cache.match(key);
    if (!response) return null;
    // Check age
    const dateHeader = response.headers.get('x-cache-date');
    if (dateHeader) {
        const age = Date.now() - Number(dateHeader);
        if (age > MAX_CACHE_AGE_MS) {
            // stale – delete
            await cache.delete(key);
            return null;
        }
    }
    return response.text();
}

/** Store SVG string in cache */
export async function setCachedSvg(key: string, svg: string): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const response = new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'x-cache-date': String(Date.now()),
        },
    });
    await cache.put(key, response);
    // Cleanup after insertion
    await cleanupCache();
}

/** Remove old entries to respect limits */
export async function cleanupCache(): Promise<void> {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    // Remove entries older than MAX_CACHE_AGE_MS
    for (const request of keys) {
        const response = await cache.match(request);
        if (!response) continue;
        const dateHeader = response.headers.get('x-cache-date');
        if (dateHeader && Date.now() - Number(dateHeader) > MAX_CACHE_AGE_MS) {
            await cache.delete(request);
        }
    }
    // Enforce max entry count (simple LRU based on header date)
    const remaining = await cache.keys();
    if (remaining.length > MAX_CACHE_ENTRIES) {
        // Sort by date header ascending (oldest first)
        const entries = await Promise.all(
            remaining.map(async (req) => {
                const resp = await cache.match(req);
                const date = resp?.headers.get('x-cache-date');
                return { req, date: date ? Number(date) : 0 };
            })
        );
        entries.sort((a, b) => a.date - b.date);
        const toDelete = entries.slice(0, entries.length - MAX_CACHE_ENTRIES);
        for (const { req } of toDelete) {
            await cache.delete(req);
        }
    }
}
