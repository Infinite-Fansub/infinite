import { IncomingMessage } from "node:http";
import { request, RequestOptions } from "node:https";
import { URL } from "node:url";
import { toJson } from "./xml2json";
import { StatusCode, IsRedirection, IsSuccessful } from "./typings";

export class Response {
    private readonly data: string;
    public constructor(data: string) {
        this.data = data;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public json(): any {
        try {
            return JSON.parse(this.data);
        } catch (err) {
            try {
                return toJson(this.data, { object: true });
            } catch (err_) {
                return err;
            }
        }
    }

    public rawData(): string {
        return this.data;
    }
}

export default async function fetch(url: string | URL, options: RequestOptions = { method: "GET" }, data: string = ""): Promise<Response> {
    if (typeof url === "string") url = new URL(url);
    return new Promise((resolve, reject) => {
        const req = request(url, options, (res: IncomingMessage) => {
            if (IsRedirection(<StatusCode>res.statusCode))
                // eslint-disable-next-line no-extra-parens
                fetch(`${(<URL>url).origin} + ${res.headers.location}`);
            else if (!IsSuccessful(<StatusCode>res.statusCode)) {
                res.resume();
                reject(new Error(`Request failed with status code: ${res.statusCode}`));
            }

            let rawData = "";
            res.setEncoding("utf8");
            res.on("data", (resData: string) => rawData += resData);
            res.on("end", () => {
                const result = new Response(rawData);
                resolve(result);
            });
        }).on("error", reject);
        if (data) req.write(data);
        req.end();

        return req;
    });
}