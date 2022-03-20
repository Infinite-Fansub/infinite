export function getCurrentMemoryHeap(): string {
    const mem = process.memoryUsage();
    const used = mem.heapUsed / 1000 / 1000;
    const total = mem.heapTotal / 1000 / 1000;

    return `${used.toFixed(2)}/${total.toFixed(2)}MB`;
}