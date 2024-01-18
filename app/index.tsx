import React, {useEffect, useRef} from "react";
import {StyleSheet, Text, View, LayoutAnimation, StatusBar} from "react-native";
import {useStore} from "../store/store";
import {SafeView} from "../components/SafeView";
import {commonStyles} from "../assets/style/styles";
import * as FileSystem from 'expo-file-system';
import {ROOT} from "../constants/constants";
import {observer} from "mobx-react-lite";
import {AudioControlPanel} from "../components/panels/AudioControlPanel";
import {FileEditPanel} from "../components/panels/FileEditPanel";
import {SoundsList} from "../components/panels/SoundsList";
import {SaveRecordModal} from "../components/modals/SaveRecordModal";
import {PositionPanel} from "../components/panels/PositionPanel";
// import {StatusBar} from "expo-status-bar";
import {DeleteModal} from "../components/modals/DeleteModal";
import {VolumePanel} from "../components/panels/VolumePanel";
import {DeleteAllModal} from "../components/modals/DeleteAllModal";
import {RenameModal} from "../components/modals/RenameModal";
import {PressableCustom} from "../components/PressableCustom";
import * as NavigationBar from 'expo-navigation-bar';

const HomeScreen = observer(() => {
    const {
        setLoading,
        getSoundFiles,
        selectedSound,
        position, setPosition,
        duration, setIsPlaying,
        isLooping,
    } = useStore();

    // load record files
    useEffect(() => {
        const getRootContent = async () => {
            try {
                setLoading(true);
                const {exists} = await FileSystem.getInfoAsync(ROOT);
                // existence check for ROOT
                if (!exists) {
                    await FileSystem.makeDirectoryAsync(ROOT);
                }
                await getSoundFiles();
            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false);
            }
        }
        getRootContent().then();
    }, [])

    // set duration position
    useEffect(() => {
        if (selectedSound) {
            selectedSound.setOnPlaybackStatusUpdate((data) => {
                if (data.isLoaded) {
                    //console.log(data.positionMillis - position)
                    setPosition(data.positionMillis);
                    if (data.positionMillis !== 0) {
                        LayoutAnimation.configureNext({
                            duration: 100,
                            update: {
                                type: "linear"
                            }
                        });
                    }
                }
            })
        }
    }, [selectedSound])

    // set setIsPlaying to false when file ended and it is not looped
    useEffect(() => {
        if (position !== 0 && duration !== 0 && position === duration && !isLooping) {
            setIsPlaying(false);
        }
    }, [position, duration])

    // unload old selectedSound when it changes
    useEffect(() => {
        const unmountHandler = async () => {
            try {
                if (selectedSound) {
                    console.log((await selectedSound.getStatusAsync())?.uri)
                    await selectedSound.unloadAsync();
                }
            } catch (e) {
                console.log(e)
            }
        }

        return () => {
            unmountHandler().then();
        }
    }, [selectedSound]);

    useEffect(() => {
        const setter = async () => {
            StatusBar.setBarStyle("light-content");
            await NavigationBar.setButtonStyleAsync("dark")
        }
        setter().then();
    })

    return (
        <SafeView style={styles.safeView}>

            <StatusBar barStyle="light-content"/>

            <View style={styles.topContent}>

                <Text style={commonStyles.screenTitle}>
                    Audio - Recording
                </Text>

                <AudioControlPanel/>
                <VolumePanel/>
                <PositionPanel/>
                <FileEditPanel/>

            </View>

            <SoundsList/>

            <SaveRecordModal/>
            <DeleteModal/>
            <DeleteAllModal/>
            <RenameModal/>

        </SafeView>
    )
})
export default HomeScreen

//========= STYLES =========//
const styles = StyleSheet.create({
    safeView: {
        padding: 0
    },
    topContent: {
        padding: 8,
        paddingBottom: 8,
    }
})