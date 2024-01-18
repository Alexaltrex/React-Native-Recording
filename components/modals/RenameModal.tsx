import {Modal, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View} from "react-native";
import {colors, ROOT} from "../../constants/constants";
import {observer} from "mobx-react-lite";
import {BlurView} from "expo-blur";
import {MaterialIcons} from "@expo/vector-icons";
import React, {useRef, useState} from "react";
import {useStore} from "../../store/store";
import {getNameExtension, getNameWithoutExtension} from "../../helpers/helpers";
import {PressableCustom} from "../PressableCustom";
import * as FileSystem from 'expo-file-system';

export const RenameModal = observer(() => {
    const {
        renameModal, setRenameModal,
        soundFiles, selectedSoundId,
        getSoundFiles,
    } = useStore()

    const {width} = useWindowDimensions();

    const onCloseHandler = () => {
        setRenameModal(false);
        setText("");
        setError("");
    }

    const [renaming, setRenaming] = useState(false);
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

    const onRename = async () => {
        try {
            setRenaming(true);
            if (soundFiles && selectedSoundId) {
                const indexOfFileInArray = soundFiles.findIndex(el => el.id === selectedSoundId);
                if (indexOfFileInArray !== -1) {
                    const from = soundFiles[indexOfFileInArray].fileInfo.uri;
                    const ext = getNameExtension(soundFiles[indexOfFileInArray].name);
                    const to = ROOT + "/" + text + "." + ext;
                    await FileSystem.moveAsync({from, to});
                    await getSoundFiles();
                    onCloseHandler();
                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            setRenaming(false);
        }
    }


    return (
        <Modal animationType="fade"
               transparent={true}
               visible={renameModal}
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

                    <Text style={styles.title}>
                        Rename recording
                    </Text>

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
                            <Pressable style={styles.clearBtn}
                                       disabled={!Boolean(text)}
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

                    <PressableCustom label={renaming ? "RENAME..." : "RENAME"}
                                     onPress={onRename}
                                     style={{marginTop: 0}}
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
    closeBtn: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    title: {
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 24,
        color: colors.main,
    },
    inputWrapper: {
        paddingTop: 16,
        paddingBottom: 25,
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
    clearBtn: {},
    error: {
        fontSize: 12,
        lineHeight: 12 * 1.5,
        position: "absolute",
        top: 18 * 1.5 + 2 * 4 + 12 * 1.5,
        left: 4,
        color: "red",
    },
})