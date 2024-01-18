export interface ISoundFile {
    id: string
    name: string
    duration: number
    fileInfo: IFileInfo
}

export interface IFileInfo {
    /**
     * Signifies that the requested file exist.
     */
    exists: true;
    /**
     * A `file://` URI pointing to the file. This is the same as the `fileUri` input parameter.
     */
    uri: string;
    /**
     * The size of the file in bytes. If operating on a source such as an iCloud file, only present if the `size` option was truthy.
     */
    size: number;
    /**
     * Boolean set to `true` if this is a directory and `false` if it is a file.
     */
    isDirectory: boolean;
    /**
     * The last modification time of the file expressed in seconds since epoch.
     */
    modificationTime: number;
    /**
     * Present if the `md5` option was truthy. Contains the MD5 hash of the file.
     */
    md5?: string;
}

export enum SortedEnum {
    name = 0,
    duration = 1,
    size = 2,
    date = 3
}