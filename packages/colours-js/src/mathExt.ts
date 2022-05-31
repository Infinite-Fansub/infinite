/*eslint-disable @typescript-eslint/naming-convention*/
/** calculates the mid() of a set of values */
export function mid(...values: Array<number>): number {
    return (Math.max(...values) + Math.min(...values)) / 2;
}

/** calculates the sum of a set of values */
export function sum(...values: Array<number>): number {
    return values.reduce((a, b) => a + b);
}

/** calculates the mean of a set of values */
export function avg(...values: Array<number>): number {
    return sum(...values) / values.length;
}

/** linear interpolation */
export function lerp(t: number, a: number, b: number): number {
    return (b - a) * t + a;
}

/** quadratic interpolation which starts at its turning point */
export function qerp_0(t: number, a: number, b: number): number {
    return (b - a) * t * t + a;
}

/** quadratic interpolation which ends at its turning point */
export function qerp_1(t: number, a: number, b: number): number {
    return (b - a) * (2 - t) * t + a;
}

/** cubic interpolation using derivatives */
export function cerp_d(t: number, a: number, b: number, aPrime = 0, bPrime = 0): number {
    return (2 * a - 2 * b + aPrime + bPrime) * t * t * t + (3 * b - 3 * a - 2 * aPrime - bPrime) * t * t + aPrime * t + a;
}

/** cubic interpolation using points */
export function cerp_pt(t: number, p0: number, p1: number, p2: number, p3: number): number {
    return (-0.5 * p0 + 1.5 * p1 - 1.5 * p2 + 0.5 * p3) * t * t * t + (p0 - 2.5 * p1 + 2 * p2 - 0.5 * p3) * t * t + (0.5 * p2 - 0.5 * p0) * t + p1;
}

/** cyclical linear interpolation using the shorter of the two immediate paths */
export function shortCyclicLerp(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;
    } else if (diff < -0.5) {
        return ((diff + 1 + cycles) * t + a) % 1;
    } else if (diff > 0) {
        return ((diff + cycles) * t + a) % 1;
    } else {
        return ((diff - cycles) * t + a + cycles) % 1;
    }
}

/** cyclical linear interpolation using the longer of the two immediate paths */
export function longCyclicLerp(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff + cycles) * t + a) % 1;
    } else if (diff < -0.5) {
        return ((diff - cycles) * t + a + cycles) % 1;
    } else if (diff > 0) {
        return ((diff - 1 - cycles) * t + a + 1 + cycles) % 1;
    } else {
        return ((diff + 1 + cycles) * t + a) % 1;
    }
}

/** cyclical quadratic interpolation which starts at its turning point using the shorter of the two immediate paths */
export function shortCyclicQerp_0(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;
    } else if (diff < -0.5) {
        return ((diff + 1 + cycles) * t * t + a) % 1;
    } else if (diff > 0) {
        return ((diff + cycles) * t * t + a) % 1;
    } else {
        return ((diff - cycles) * t * t + a + cycles) % 1;
    }
}

/** cyclical quadratic interpolation which starts at its turning point using the longer of the two immediate paths */
export function longCyclicQerp_0(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff + cycles) * t * t + a) % 1;
    } else if (diff < -0.5) {
        return ((diff - cycles) * t * t + a + cycles) % 1;
    } else if (diff > 0) {
        return ((diff - 1 - cycles) * t * t + a + 1 + cycles) % 1;
    } else {
        return ((diff + 1 + cycles) * t * t + a) % 1;
    }
}

/** cyclical quadratic interpolation which ends at its turning point using the shorter of the two immediate paths */
export function shortCyclicQerp_1(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;
    } else if (diff < -0.5) {
        return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;
    } else if (diff > 0) {
        return ((diff + cycles) * (2 - t) * t + a) % 1;
    } else {
        return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;
    }
}

/** cyclical quadratic interpolation which ends at its turning point using the longer of the two immediate paths */
export function longCyclicQerp_1(t: number, a: number, b: number, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return ((diff + cycles) * (2 - t) * t + a) % 1;
    } else if (diff < -0.5) {
        return ((diff - cycles) * (2 - t) * t + a + cycles) % 1;
    } else if (diff > 0) {
        return ((diff - 1 - cycles) * (2 - t) * t + a + 1 + cycles) % 1;
    } else {
        return ((diff + 1 + cycles) * (2 - t) * t + a) % 1;
    }
}

function increasingCyclicCerp_d(t: number, a: number, aPrime: number, bPrime: number, cycles: number, diff: number): number {
    return ((-2 * (diff + cycles) + aPrime + bPrime) * t * t * t + (3 * (diff + cycles) - 2 * aPrime - bPrime) * t * t + aPrime * t + a) % 1;
}

function decreasingCyclicCerp_d(t: number, a: number, aPrime: number, bPrime: number, cycles: number, diff: number): number {
    return ((-2 * (diff - cycles) + aPrime + bPrime) * t * t * t + (3 * (diff - cycles) - 2 * aPrime - bPrime) * t * t + aPrime * t + a + cycles) % 1;
}

/** cyclical cubic interpolation using derivatives using the shorter of the two immediate paths */
export function shortCyclicCerp_d(t: number, a: number, b: number, aPrime = 0, bPrime = 0, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return increasingCyclicCerp_d(t, a, aPrime, bPrime, cycles + 1, diff);
    } else if (diff < -0.5) {
        return decreasingCyclicCerp_d(t, a, aPrime, bPrime, cycles + 1, diff);
    } else if (diff > 0) {
        return increasingCyclicCerp_d(t, a, aPrime, bPrime, cycles, diff);
    } else {
        return decreasingCyclicCerp_d(t, a, aPrime, bPrime, cycles, diff);
    }
}

/** cyclical cubic interpolation using derivatives using the longer of the two immediate paths */
export function longCyclicCerp_d(t: number, a: number, b: number, aPrime = 0, bPrime = 0, cycles = 0): number {
    const diff = b - a;
    if (diff > 0.5) {
        return increasingCyclicCerp_d(t, a, aPrime, bPrime, cycles, diff);
    } else if (diff < -0.5) {
        return decreasingCyclicCerp_d(t, a, aPrime, bPrime, cycles, diff);
    } else if (diff > 0) {
        return increasingCyclicCerp_d(t, a, aPrime, bPrime, cycles + 1, diff);
    } else {
        return decreasingCyclicCerp_d(t, a, aPrime, bPrime, cycles + 1, diff);
    }
}

/** ensures the sum of an array equals 1 */
export function normalize_1D(nums: Array<number>): Array<number> {
    let total = sum(...nums);
    nums.forEach((v, i) => nums[i] = v / total);
    return nums;
}