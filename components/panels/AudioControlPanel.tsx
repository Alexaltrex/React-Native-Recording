import {Animated, Pressable, StyleSheet, View} from "react-native";
import React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {colors} from "../../constants/constants";
import {Entypo, Ionicons, MaterialIcons} from "@expo/vector-icons";
import {Audio} from 'expo-av';
import {commonStyles} from "../../assets/style/styles";

export const AudioControlPanel = observer(() => {
    const {
        isRecording, setIsRecording,
        isLooping, setIsLooping,
        loading,
        isPlaying, setIsPlaying,
        selectedSound,
        isMuted, setIsMuted,
        position, setPosition,
        duration,
        setRecording,
        setSaveRecordModal,
        volume,
        isPaused, setIsPaused,
    } = useStore();

    const onPlayPress = async () => {
        try {
            if (!isRecording && selectedSound) {
                setIsPlaying(true);
                setIsPaused(false);
                await selectedSound.setStatusAsync({
                    volume,
                    isMuted,
                    isLooping,
                    shouldPlay: true,
                    positionMillis: position === duration ? 0 : undefined,
                    progressUpdateIntervalMillis: 100,
                })
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onPausePress = async () => {
        try {
            if (!isRecording && isPlaying && selectedSound) {
                setIsPlaying(false);
                setIsPaused(true);
                await selectedSound.pauseAsync();
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onStopPress = async () => {
        try {
            if (!isRecording && selectedSound) {
                setIsPaused(false);
                setIsPlaying(false);
                await selectedSound.stopAsync();
                setPosition(0);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onRecordPress = async () => {
        try {
            if (!isPlaying) {
                setSaveRecordModal(true);
                setIsRecording(true);
                await Audio.requestPermissionsAsync();
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                const {recording} = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
                setRecording(recording);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const onMutePress = async () => {
        try {
            if (!isRecording) {
                if (selectedSound) {
                    await selectedSound.setStatusAsync({
                        isMuted: !isMuted
                    })
                }
                setIsMuted(!isMuted);
            }
        } catch (e) {
            console.log(e)
        }
    }

    const onLoopPress = async () => {
        try {
            if (selectedSound) {
                await selectedSound.setStatusAsync({
                    isLooping: !isLooping
                })
            }
            setIsLooping(!isLooping);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <View style={[commonStyles.panel, {marginTop: 8, paddingVertical: 4,}]}>
            <View style={styles.playControls}>
                {
                    [
                        {
                            iconName: "play-arrow",
                            iconType: "materialIcons",
                            onPress: onPlayPress,
                            disabled: isRecording || loading,
                            color: (isRecording || loading) ? colors.disabled : isPlaying ? colors.playing : colors.enabled,
                            style: {marginRight: 4},
                        },
                        {
                            iconName: "pause",
                            iconType: "materialIcons",
                            onPress: onPausePress,
                            disabled: isRecording || loading,
                            color: (isRecording || loading) ? colors.disabled : isPaused ? colors.playing : colors.enabled,
                            style: {marginRight: 4},
                        },
                        {
                            iconName: "stop",
                            iconType: "materialIcons",
                            onPress: onStopPress,
                            disabled: isRecording || loading,
                            color: (isRecording || loading) ? colors.disabled : colors.enabled,
                            style: {marginRight: 4},
                        },
                        {
                            iconName: isMuted ? "volume-mute" : "volume-high",
                            iconType: "ionicons",
                            onPress: onMutePress,
                            disabled: isRecording || loading,
                            color: (isRecording || loading) ? colors.disabled : colors.enabled,
                            style: {marginRight: 16},
                        },
                        {
                            iconName: "loop",
                            iconType: "entypo",
                            onPress: onLoopPress,
                            disabled: isRecording || loading,
                            color: (isRecording || loading) ? colors.disabled : isLooping ? colors.enabled : colors.disabled,
                            style: {},
                        },
                    ].map(({
                               iconName,
                               iconType,
                               onPress,
                               style,
                               disabled,
                               color
                           }, key) => (
                        <Pressable key={key}
                                   style={[style, {backgroundColor: "transparent"}]}
                                   onPress={onPress}
                                   disabled={disabled}
                        >

                            {
                                iconType === "materialIcons" && (
                                    <MaterialIcons name={iconName}
                                                   size={36}
                                                   color={color}
                                    />
                                )
                            }
                            {
                                iconType === "ionicons" && (
                                    <Ionicons name={iconName}
                                              size={36}
                                              color={color}
                                    />
                                )
                            }
                            {
                                iconType === "entypo" && (
                                    <Entypo name={iconName}
                                            size={36}
                                            color={color}
                                    />
                                )
                            }
                        </Pressable>
                    ))
                }
            </View>

            <Pressable disabled={isPlaying || loading}
                       onPress={onRecordPress}
            >
                <Animated.View style={[
                    styles.recordButton,
                    (isPlaying || loading) && {borderColor: colors.disabled},
                ]}>
                    <Animated.View style={[
                        styles.recordButtonCenter,
                        (isPlaying || loading) && {backgroundColor: colors.disabled},
                    ]}
                    />
                </Animated.View>

            </Pressable>
        </View>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    playControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    recordButton: {
        width: 36,
        height: 36,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: colors.record,
        justifyContent: "center",
        alignItems: "center",
    },
    recordButtonCenter: {
        width: 20,
        height: 20,
        borderRadius: 999,
        backgroundColor: colors.record,
    },
})