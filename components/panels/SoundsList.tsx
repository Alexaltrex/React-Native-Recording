import {ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View} from "react-native";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {colors} from "../../constants/constants";
import React, {useEffect} from "react";
import {compareFn, getDuration, getFolderDate, getNameWithoutExtension, getSizeInMB} from "../../helpers/helpers";
import {MaterialIcons} from "@expo/vector-icons";
import {Audio} from 'expo-av';
import {HeaderSortedButton} from "../HeaderSortedButton";
import {SortedEnum} from "../../types/types";

export const SoundsList = observer(() => {
    const {
        loading,
        soundFiles, setSoundFiles,
        selectedSound, setSelectedSound,
        setDuration,
        selectedSoundId, setSelectedSoundId,
        sortedDirection, setSortedDirection,
        sorted, setSorted,
        setIsPlaying, setIsPaused, setPosition,
    } = useStore();

    useEffect(() => {
        if (soundFiles) {
            setSoundFiles([...soundFiles].sort(compareFn(sorted, sortedDirection)))
        }
    }, [sorted, sortedDirection])

    const onCheckPress = async (id: string) => {
        try {
            if (soundFiles && id) {
                setIsPlaying(false);
                setIsPaused(false);
                setPosition(0);

                if (id === selectedSoundId) {
                    setSelectedSoundId("");
                    setSelectedSound(null);
                    setDuration(0);
                } else {
                    setSelectedSoundId(id);
                    const indexOfSelectedSound = soundFiles.findIndex(el => el.id === id);
                    if (indexOfSelectedSound !== -1) {
                        const {sound, status} = await Audio.Sound.createAsync({
                            uri: soundFiles[indexOfSelectedSound].fileInfo.uri
                        })
                        if (status.isLoaded) {
                            setSelectedSound(sound);
                            setDuration(status.durationMillis || 0);
                        }
                    }
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    const onSortPress = (_sorted: SortedEnum) => {
        if (_sorted !== sorted) {
            setSorted(_sorted);
            setSortedDirection(1);
        } else {
            setSortedDirection(sortedDirection === 1 ? -1 : 1);
        }
    }

    return (
        <View style={styles.soundsList}>
            <View style={[styles.soundsListRow, styles.soundsListHeader]}>

                <HeaderSortedButton label="Name"
                                    sorted={SortedEnum.name}
                                    currentSorted={sorted}
                                    sortedDirection={sortedDirection}
                                    onPress={() => onSortPress(SortedEnum.name)}
                />


                <View style={styles.soundsListRowRight}>
                    <HeaderSortedButton label="Dur."
                                        sorted={SortedEnum.duration}
                                        currentSorted={sorted}
                                        sortedDirection={sortedDirection}
                                        onPress={() => onSortPress(SortedEnum.duration)}
                                        style={{width: 50}}
                    />

                    <HeaderSortedButton label="Size"
                                        sorted={SortedEnum.size}
                                        currentSorted={sorted}
                                        sortedDirection={sortedDirection}
                                        onPress={() => onSortPress(SortedEnum.size)}
                                        style={{width: 45}}
                    />

                    <HeaderSortedButton label="Date"
                                        sorted={SortedEnum.date}
                                        currentSorted={sorted}
                                        sortedDirection={sortedDirection}
                                        onPress={() => onSortPress(SortedEnum.date)}
                                        style={{width: 120}}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                {
                    soundFiles && soundFiles.map(({
                                                      id,
                                                      name,
                                                      duration,
                                                      fileInfo
                                                  }, key) => (
                        <View key={key}
                              style={styles.soundsListRow}
                        >
                            <Text style={[styles.headerText, id === selectedSoundId && {color: colors.playing}]}>
                                {getNameWithoutExtension(name)}
                            </Text>

                            <View style={styles.soundsListRowRight}>
                                <Text
                                    style={[styles.rowTextSmall, {width: 50}, id === selectedSoundId && styles.textSelected]}>
                                    {getDuration(duration)}
                                </Text>
                                <Text
                                    style={[styles.rowTextSmall, {width: 45}, id === selectedSoundId && styles.textSelected]}>
                                    {getSizeInMB(fileInfo.size)}
                                </Text>
                                <Text
                                    style={[styles.rowTextSmall, {width: 82}, id === selectedSoundId && styles.textSelected]}>
                                    {getFolderDate(fileInfo.modificationTime)}
                                </Text>

                                <Pressable style={{padding: 4}}
                                           onPress={() => onCheckPress(id)}
                                >
                                    <MaterialIcons
                                        name={id === selectedSoundId ? "check-box" : "check-box-outline-blank"}
                                        color={id === selectedSoundId ? colors.playing : "#FFF"}
                                        size={30}
                                    />
                                </Pressable>
                            </View>


                        </View>
                    ))
                }

                {
                    loading && (
                        <View style={styles.loadingWrapper}>
                            <ActivityIndicator size="large"
                                               color={colors.playing}
                                               style={{}}
                            />
                        </View>
                    )
                }

                {
                    !loading && soundFiles && soundFiles.length === 0 && (
                        <View style={styles.loadingWrapper}>
                            <Text style={styles.empty}>
                                EMPTY
                            </Text>
                        </View>

                    )
                }

            </ScrollView>

        </View>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    soundsList: {
        flex: 1,
        marginTop: 0,
        backgroundColor: colors.main,
    },
    soundsListHeader: {
        backgroundColor: colors.mainDark,
    },
    soundsListRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 8,
    },
    soundsListRowRight: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 12,
        color: "#FFF",
    },
    rowTextSmall: {
        fontSize: 12,
        color: "#FFF",
    },
    textSelected: {
        color: colors.playing
    },
    loadingWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    empty: {
        fontWeight: "bold",
        fontSize: 60,
        color: "rgba(0,0,0,0.15)",
    }
})