import {Modal, Pressable, StyleSheet, Text, useWindowDimensions, View} from "react-native";
import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {BlurView} from "expo-blur";
import {MaterialIcons} from "@expo/vector-icons";
import {colors} from "../../constants/constants";
import {PressableCustom} from "../PressableCustom";
import * as FileSystem from 'expo-file-system';

export const DeleteModal = observer(() => {
    const {
        deleteModal, setDeleteModal,
        soundFiles, getSoundFiles,
        selectedSoundId, setSelectedSoundId,
    } = useStore();

    const [deleting, setDeleting] = useState(false);

    const {width} = useWindowDimensions();

    const onCloseHandler = () => setDeleteModal(false);
    const deletedFileName = (soundFiles && selectedSoundId && soundFiles.findIndex(el => el.id === selectedSoundId) !== -1)
        ? soundFiles[soundFiles.findIndex(el => el.id === selectedSoundId)].name
        : ""

    const onDelete = async () => {
        try {
            setDeleting(true);
            if (soundFiles && selectedSoundId) {
                const indexOfFileInArray = soundFiles.findIndex(el => el.id === selectedSoundId);
                if (indexOfFileInArray !== -1) {
                    await FileSystem.deleteAsync(soundFiles[indexOfFileInArray].fileInfo.uri);
                    await getSoundFiles();
                    setSelectedSoundId("");
                    setDeleteModal(false);

                }
            }
        } catch (e) {
            console.log(e)
        } finally {
            setDeleting(false);
        }
    }

    return (
        <Modal animationType="fade"
               transparent={true}
               visible={deleteModal}
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
                        Delete <Text style={styles.name}>{deletedFileName || ""}</Text>?
                    </Text>

                    <View style={styles.buttons}>
                        <PressableCustom label={deleting ? "Deleting..." : "YES"}
                                         onPress={onDelete}
                                         style={{
                                             width: "49%",
                                         }}
                        />
                        <PressableCustom label="NO"
                                         onPress={onCloseHandler}
                                         style={{
                                             width: "49%",
                                             backgroundColor: colors.mainLight
                                         }}


                        />
                    </View>

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
    name: {
        color: colors.grey,
        fontStyle: "italic",
        fontWeight: "bold",
    },
    buttons: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    }
})