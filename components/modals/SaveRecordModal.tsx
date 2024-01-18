import React, {useEffect, useRef, useState} from "react";
import {Animated, Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View} from "react-native";
import {BlurView} from "expo-blur";
import {MaterialIcons} from '@expo/vector-icons';
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import * as FileSystem from 'expo-file-system';
import {colors, ROOT} from "../../constants/constants";
import {PressableCustom} from "../PressableCustom";
import {getNameWithoutExtension, getRecordName} from "../../helpers/helpers";
import {useRecordAnim} from "../../hooks/useRecordAnim";
import {Audio} from 'expo-av';
import {format} from "date-fns";

export const SaveRecordModal = observer(() => {
    const {
        saveRecordModal, setSaveRecordModal,
        isRecording, setIsRecording,
        recording,
        soundFiles,
        getSoundFiles,
        setRecording,
    } = useStore();

    const {width} = useWindowDimensions();

    const [saving, setSaving] = useState(false);
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [focus, setFocus] = useState(false);
    const textInputRef = useRef<TextInput>(null!);

    const onClear = () => setText("");

    const onChangeText = (text: string) => {
        setText(text);

        if (soundFiles) {
            setError("");
            if (!text) {
                setError("required")
            }
            if (soundFiles.findIndex(el => getNameWithoutExtension(el.name) === text) !== -1) {
                setError("already exist")
            }
        }
    }

    const onStopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync(); // Stops the recording and deallocates the recorder from memory
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false
                })
            }
            setIsRecording(false);
        } catch (e) {
            console.log(e)
        }
    }

    const onSaveHandler = async () => {
        try {
            setSaving(true);
            if (recording && soundFiles) {
                if (!error) {
                    const uri = recording.getURI(); // Gets the local URI of the Recording
                    if (uri) {
                        const splittedArray = uri.split(".");
                        const ext = splittedArray[splittedArray.length - 1];
                        await FileSystem.moveAsync({
                            from: uri,
                            to: ROOT + "/" + text + "." + ext,
                        });
                        await getSoundFiles();
                    }
                    setRecording(null);
                    setText("");
                    setSaveRecordModal(false);
                    setTime(0);
                }
            }

        } catch (e) {
            console.log(e)
        } finally {
            setSaving(false);
        }
    }

    const onCloseHandler = async () => {
        try {
            await onStopRecording();
            setSaveRecordModal(false);
            setRecording(null);
            setText("");
            setError("");
            setTime(0);
        } catch (e) {
            console.log(e)
        }

    }

    // set new default record name every time when modal open
    useEffect(() => {
        if (saveRecordModal) {
            setText(soundFiles ? `record_${getRecordName(soundFiles.length)}` : "");
        }
    }, [saveRecordModal])

    const {animParam} = useRecordAnim(isRecording);

    // timer
    const [time, setTime] = useState(0);
    useEffect(() => {
        const timeId = setTimeout(() => {
            //console.log("timeId, ", new Date())
            if (isRecording) {
                setTime(time => time + 1);
            }
        }, 1000);
        return () => {
            clearTimeout(timeId);
        }
    }, [time, isRecording])

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={saveRecordModal}
        >
            <BlurView style={styles.modalContainer}
                      intensity={25}
                      tint="dark"
            >
                <View style={[styles.modalCard, {
                    width: width - 32
                }]}>

                    <Pressable style={styles.closeBtn}
                               onPress={onCloseHandler}
                    >
                        <MaterialIcons name="close" size={36} color="black"/>
                    </Pressable>


                    <View style={styles.titleWrapper}>

                        <Animated.View style={[
                            styles.recordButton,
                            isRecording && {
                                borderColor: animParam.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [colors.record, colors.enabled]
                                }),
                            }
                        ]}>
                            <Animated.View style={[
                                styles.recordButtonCenter,
                                isRecording && {
                                    backgroundColor: animParam.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [colors.record, colors.enabled]
                                    })
                                }
                            ]}
                            />
                        </Animated.View>

                        <Text style={styles.title}>Recording</Text>

                    </View>

                    {
                        isRecording ? (
                            <View style={styles.timeWrapper}>
                                <Text style={styles.time}>
                                    {format(new Date(1000 * time), "mm:ss")}
                                </Text>
                            </View>
                        ) : (
                            <View>
                                <View style={styles.inputWrapper}>
                                    <TextInput ref={textInputRef}
                                               value={text}
                                               onChangeText={onChangeText}
                                               placeholder={"Enter name"}
                                               onFocus={() => setFocus(true)}
                                               onBlur={() => setFocus(false)}
                                               style={[styles.input, focus && styles.inputFocused]}
                                               autoCapitalize={"none"}
                                    />
                                    <Pressable disabled={!Boolean(text)}
                                               onPress={onClear}
                                    >
                                        <MaterialIcons name="delete"
                                                       size={30}
                                                       color={Boolean(text) ? "#000" : "#727272"}
                                        />
                                    </Pressable>
                                </View>
                                {error && <Text style={styles.error}>{error}</Text>}
                            </View>
                        )
                    }

                    <PressableCustom label={
                        isRecording
                            ? "Stop recording"
                            : saving ? "Save recording..." : "Save recording"
                    }
                                     onPress={isRecording ? onStopRecording : onSaveHandler}
                                     disabled={!Boolean(text)}

                    />
                </View>
            </BlurView>
        </Modal>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.5)",
    },
    modalCard: {
        backgroundColor: "#FFF",
        paddingVertical: 40,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    titleWrapper: {
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: colors.main,
    },
    recordButton: {
        width: 30,
        height: 30,
        borderRadius: 999,
        borderWidth: 2,
        borderColor: colors.enabled,
        justifyContent: "center",
        alignItems: "center",
    },
    recordButtonCenter: {
        width: 15,
        height: 15,
        borderRadius: 999,
        backgroundColor: colors.enabled,
    },
    title: {
        marginLeft: 8,
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 24,
        color: "#FFF",
    },
    closeBtn: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    timeWrapper: {
        height: 83,
        justifyContent: "center",
    },
    time: {
        textAlign: "center",
        fontSize: 50,
        color: colors.record
    },
    inputWrapper: {
        paddingTop: 16,
        paddingBottom: 30,
        flexDirection: "row",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 4,
        fontSize: 18,
        lineHeight: 18 * 1.5,
        paddingHorizontal: 8,
        paddingVertical: 4,
        textAlignVertical: "center"
    },
    inputFocused: {
        borderColor: "blue",
    },
    error: {
        fontSize: 12,
        lineHeight: 12 * 1.5,
        position: "absolute",
        top: 18 * 1.5 + 2 * 4 + 12 * 1.5,
        left: 4,
        color: "red",
    },
})