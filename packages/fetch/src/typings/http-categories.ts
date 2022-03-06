import { StatusCode } from "./statuscodes";

export function IsInformational(code: StatusCode): boolean {
    return Math.floor(code / 100) === 1;
}

export function IsSuccessful(code: StatusCode): boolean {
    return Math.floor(code / 100) === 2;
}

export function IsRedirection(code: StatusCode): boolean {
    return Math.floor(code / 100) === 3;
}

export function IsClientError(code: StatusCode): boolean {
    return Math.floor(code / 100) === 4;
}

export function IsServerError(code: StatusCode): boolean {
    return Math.floor(code / 100) === 5;
}