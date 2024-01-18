import {format} from "date-fns";
import {ISoundFile, SortedEnum} from "../types/types";

export const getFolderDate = (time: number): string => format(new Date(1000 * time), "dd.MM.yy HH:mm");

export const getDuration = (duration: number): string => format(new Date(duration), "mm:ss");

export const getNameWithoutExtension = (name: string): string => {
    const splitted = name.split(".");
    return splitted.slice(0, splitted.length - 1).join(".")
}

export const getNameExtension = (name: string): string => {
    const splitted = name.split(".");
    return splitted[splitted.length - 1]
}

export const getSizeInMB = (sizeInBytes: number): string => {
    return (sizeInBytes / 1048576).toFixed(2)
}

export const getRecordName = (length: number) => {
    if (String(length).length === 1) return "0" + length
    if (String(length).length === 2) return "" + length
}

export const compareFn = (sorted: SortedEnum, sortedDirection: number) => (a: ISoundFile, b: ISoundFile) => {
    let valueA;
    let valueB;
    if (sorted === SortedEnum.name) {
        valueA = a.name;
        valueB = b.name;
    }
    if (sorted === SortedEnum.size) {
        valueA = a.fileInfo.size;
        valueB = b.fileInfo.size;
    }
    if (sorted === SortedEnum.duration) {
        valueA = a.duration;
        valueB = b.duration;
    }
    if (sorted === SortedEnum.date) {
        valueA = a.fileInfo.modificationTime;
        valueB = b.fileInfo.modificationTime;
    }
    if (valueA > valueB) {
        return sortedDirection
    }
    if (valueA < valueB) {
        return -sortedDirection
    }
    return 0
}