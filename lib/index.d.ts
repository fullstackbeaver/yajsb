import { createDirectory, getFolderContent, getFolderContentRecursive, readFileAsString, writeToFile } from "@adapters/files/files";
import { firstLetterLowerCase, firstLetterUppercase } from "@core/utils";
export { useComponent } from "@core/components/component";
export { describeComponent } from "@core/components/component";
export declare function startYajsb(): Promise<void>;
export declare const utils: {
    firstLetterLowerCase: typeof firstLetterLowerCase;
    firstLetterUppercase: typeof firstLetterUppercase;
    createDirectory: typeof createDirectory;
    getFolderContent: typeof getFolderContent;
    getFolderContentRecursive: typeof getFolderContentRecursive;
    readFileAsString: typeof readFileAsString;
    writeToFile: typeof writeToFile;
};
export declare const constants: {
    componentFolder: string;
    dataExtension: string;
    index: string;
    pageFolder: string;
    projectRoot: string;
    templateExtension: string;
    templateFolder: string;
    tsExtension: string;
};
