export interface GradientHalfs {
    firstHalf: string,
    secondHalf: string
}

export type strTypes = string | Array<string>;

export function divideString(str: string): GradientHalfs {

    const half = (x: strTypes): number => x.length / 2;
    let firstHalf: strTypes = "";
    let secondHalf: strTypes = "";

    if (str.indexOf(" ") >= 1) {
        const arr = str.split(/ /g);
        firstHalf = arr.slice(0, half(arr)).join(" ");
        secondHalf = arr.slice(half(arr)).join(" ");
    } else {
        firstHalf = str.substring(-1, half(str));
        secondHalf = str.substring(half(str));
    }
    return { firstHalf, secondHalf };
}