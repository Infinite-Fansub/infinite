import { SFW_TYPES, NSFW_TYPES } from "src/constants";

export type StatusReturn = {
    code: 404,
    message: string,
    rendered_in: string,
    success: false
};

/**
 * {@link https://api.nekos.dev/api/v3/images/}
 */
export type ImagesReturn = {
    data: {
        response: { types: ["sfw", "nsfw"] },
        status: StatusReturn
    }
};

/**
 * {@link https://api.nekos.dev/api/v3/images/sfw/}
 */
export type ImagesSFWReturn = {
    data: {
        response: { formats: ["img", "gif"] },
        status: StatusReturn
    }
};

/**
 * {@link https://api.nekos.dev/api/v3/images/nsfw/}
 */
export type ImagesNSFWReturn = ImagesSFWReturn;

/**
 * {@link https://api.nekos.dev/api/v3/images/sfw/img/}
 */
export type SFWImageReturn = {
    data: {
        response: {
            categories: Array<SFWTypes>,
            formats: ["img", "gif"],
            types: ["sfw", "nsfw"]
        },
        status: StatusReturn
    }
};

type SFWTypes = typeof SFW_TYPES[number];

/**
 * {@link https://api.nekos.dev/api/v3/images/nsfw/img/}
 */
export type NSFWImageReturn = {
    data: {
        response: {
            categories: Array<NSFWTypes>,
            formats: ["img", "gif"],
            types: ["sfw", "nsfw"]
        },
        status: StatusReturn
    }
};

type NSFWTypes = typeof NSFW_TYPES[number];