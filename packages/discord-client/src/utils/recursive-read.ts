import { readdirSync } from "fs";

/**
 * Recursively read a directory
 *
 * @param path - The path of the directory to read
 * @param ignore - The file extensions to ignore
 */
export default function recursiveReaddirSync(path: string, ignore: Array<string> = [".d.ts", ".d.ts.map"]): Array<string> {
    return readdirSync(path, { withFileTypes: true })
        .flatMap((dirent) => dirent.isDirectory()
            ? recursiveReaddirSync(`${path}/${dirent.name}`)
            : !ignore.some((s) => dirent.name.endsWith(s)) ? `${path}/${dirent.name}` : []);
}