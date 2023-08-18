import { Color } from "colours.js/dst";

export type PrettyErrorOptions = {

    /**
     * Is it an error or debug or something else
     * @defaultValue "error"
     */
    type?: string,
    code?: string,

    /**
     * The project name
     * This helps errors to point to the proper file
     */
    reference?: string,
    lines?: Array<{ error: string, marker: MarkerOptions }>
};

export type MarkerOptions = {
    text: string,
    color?: Color,

    /**
     * Adds a new line before the marker
     */
    spacedBefore?: boolean,

    /**
     * Adds a new line after the marker so the error is under it
     */
    newLine?: boolean
};