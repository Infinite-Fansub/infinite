import { Color } from "colours.js/dst";

export type ReadLineOptions = {
    defaultText?: string,
    prompt?: string,

    /**
     * @alpha Not Implemented yet
     */
    solid?: boolean,

    /**
     * @alpha Not Implemented yet
     */
    color?: string | Color
};