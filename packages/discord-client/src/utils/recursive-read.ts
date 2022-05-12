import { readdirSync } from "fs";

export default function recursiveReaddirSync(path: string, ignore: Array<string> = [".d.ts", ".d.ts.map"]): Array<string> {
    return readdirSync(path, { withFileTypes: true })
        .flatMap((dirent) => dirent.isDirectory()
            ? recursiveReaddirSync(`${path}/${dirent.name}`)
            : !ignore.some((s) => dirent.name.endsWith(s)) ? `${path}/${dirent.name}` : []);
}