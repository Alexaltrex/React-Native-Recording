import {action, makeObservable, observable} from "mobx"
import {createContext, useContext} from "react";
import {Audio} from 'expo-av';
import {ISoundFile, IFileInfo, SortedEnum} from "../types/types";
import {ROOT} from "../constants/constants";
import * as FileSystem from 'expo-file-system';
import 'react-native-get-random-values';

export class Store {
    loading = false
    isRecording = false
    isPlaying = false
    isPaused = false
    isMuted = false
    isLooping = false
    selectedSoundId = ""
    selectedSound = null as null | Audio.Sound
    volume = 0.5
    soundFiles = null as null | ISoundFile[]
    position = 0
    duration = 0
    recording = null as null | Audio.Recording
    saveRecordModal = false
    deleteModal = false
    deleteAllModal = false
    renameModal = false
    sortedDirection = 1
    sorted = SortedEnum.name
    freeSize = null as null | number
    totalSize = null as null | number

    constructor() {
        makeObservable(this, {
            loading: observable,
            isRecording: observable,
            isPlaying: observable,
            isPaused: observable,
            isMuted: observable,
            isLooping: observable,
            selectedSoundId: observable,
            selectedSound: observable,
            volume: observable,
            soundFiles: observable,
            position: observable,
            duration: observable,
            recording: observable,
            saveRecordModal: observable,
            deleteModal: observable,
            deleteAllModal: observable,
            renameModal: observable,
            sortedDirection: observable, // -1, 1
            sorted: observable,
            freeSize: observable,
            totalSize: observable,

            setLoading: action.bound,
            setIsRecording: action.bound,
            setIsPlaying: action.bound,
            setIsPaused: action.bound,
            setIsMuted: action.bound,
            setIsLooping: action.bound,
            setSelectedSoundId: action.bound,
            setSelectedSound: action.bound,
            setVolume: action.bound,
            setSoundFiles: action.bound,
            setPosition: action.bound,
            setDuration: action.bound,
            setRecording: action.bound,
            setSaveRecordModal: action.bound,
            setDeleteModal: action.bound,
            setDeleteAllModal: action.bound,
            setRenameModal: action.bound,
            getSoundFiles: action.bound,
            setSortedDirection: action.bound,
            setSorted: action.bound,
            setFreeSize: action.bound,
            setTotalSize: action.bound,
        })
    }

    setLoading(loading: boolean) {
        this.loading = loading
    }

    setIsRecording(isRecording: boolean) {
        this.isRecording = isRecording
    }

    setIsPlaying(isPlaying: boolean) {
        this.isPlaying = isPlaying
    }

    setIsPaused(isPaused: boolean) {
        this.isPaused = isPaused
    }

    setIsMuted(isMuted: boolean) {
        this.isMuted = isMuted
    }

    setIsLooping(isLooping: boolean) {
        this.isLooping = isLooping
    }

    setSelectedSoundId(selectedSoundId: string) {
        this.selectedSoundId = selectedSoundId
    }

    setSelectedSound(selectedSound: null | Audio.Sound) {
        this.selectedSound = selectedSound
    }

    setVolume(volume: number) {
        this.volume = volume
    }

    setSoundFiles(soundFiles: ISoundFile[]) {
        this.soundFiles = soundFiles
    }

    setPosition(position: number) {
        this.position = position
    }

    setDuration(duration: number) {
        this.duration = duration
    }

    setRecording(recording: null | Audio.Recording) {
        this.recording = recording
    }

    setSaveRecordModal(saveRecordModal: boolean) {
        this.saveRecordModal = saveRecordModal
    }

    setDeleteModal(deleteModal: boolean) {
        this.deleteModal = deleteModal
    }

    setRenameModal(renameModal: boolean) {
        this.renameModal = renameModal
    }

    setDeleteAllModal(deleteAllModal: boolean) {
        this.deleteAllModal = deleteAllModal
    }

    setSortedDirection(sortedDirection: number) {
        this.sortedDirection = sortedDirection;
    }

    setSorted(sorted: SortedEnum) {
        this.sorted = sorted
    }

    setFreeSize(freeSize: number) {
        this.freeSize = freeSize
    }

    setTotalSize(totalSize: number) {
        this.totalSize = totalSize
    }

    async getSoundFiles() {
        try {
            //this.setLoading(true);
            const soundNames = await FileSystem.readDirectoryAsync(ROOT);
            const _sounds = [] as ISoundFile[];

            const freeSize = await FileSystem.getFreeDiskStorageAsync();
            this.setFreeSize(freeSize);
            const totalSize = await FileSystem.getTotalDiskCapacityAsync();
            this.setTotalSize(totalSize);

            for (let i = 0; i < soundNames.length; i++) {
                const fileUri = ROOT + "/" + soundNames[i];

                const {status} = await Audio.Sound.createAsync({
                    uri: fileUri
                })
                if (status.isLoaded) {
                    const fileInfo = await FileSystem.getInfoAsync(fileUri);
                    if (fileInfo.exists) {
                        _sounds.push({
                            id: String(fileInfo.modificationTime),
                            name: soundNames[i],
                            duration: status.durationMillis as number,
                            fileInfo: fileInfo as IFileInfo,
                        })
                    }
                }
            }
            this.setSoundFiles(_sounds);
        } catch (e) {
            console.log(e);
        } finally {
            //this.setLoading(false);
        }
    }

}

export const store = new Store();

export const StoreContext = createContext<Store>({} as Store);

export const useStore = (): Store => useContext(StoreContext);

