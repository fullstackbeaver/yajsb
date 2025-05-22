/**
 * Compile the sass files in the /css folder and write the result to /public/style.css.
 * @param prod - If true, the style of the generated css will be compressed.
 *               If false, source maps will be included.
 *
 * @returns A promise that resolves when the generation is finished.
 */
export declare function makeCss(prod?: boolean): Promise<void>;
