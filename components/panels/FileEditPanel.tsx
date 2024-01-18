import {observer} from "mobx-react-lite";
import {StyleSheet, View, Text} from "react-native";
import {commonStyles} from "../../assets/style/styles";
import {colors} from "../../constants/constants";
import React from "react";
import {useStore} from "../../store/store";
import {FileEditButton} from "../FileEditButton";
import {getSizeInMB} from "../../helpers/helpers";

export const FileEditPanel = observer(() => {
    const {
        isRecording,
        isPlaying,
        loading,
        selectedSoundId,
        setDeleteModal,
        setDeleteAllModal,
        setRenameModal,
        freeSize, totalSize,
        soundFiles
    } = useStore();

    const onDeletePress = () => setDeleteModal(true);
    const onDeleteAllPress = () => setDeleteAllModal(true);
    const onRenameModal = () => setRenameModal(true);

    return (
        <View style={[commonStyles.panel, {paddingVertical: 4}]}>

            <View style={styles.infoPanel}>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={styles.infoText}>Free size, MB: </Text>
                    <Text style={styles.infoText}>{getSizeInMB(freeSize || 0)}</Text>
                </View>
                <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                    <Text style={styles.infoText}>Total size, MB:</Text>
                    <Text style={styles.infoText}>{getSizeInMB(totalSize || 0)}</Text>
                </View>
            </View>

            <View style={styles.editPanel}>
                <FileEditButton materialIconsName="edit"
                                 label="rename"
                                 disabled={loading || isPlaying || isRecording || !selectedSoundId}
                                 onPress={onRenameModal}
                                 customStyle={{marginLeft: 0}}

                />
                <FileEditButton materialIconsName="delete"
                                 label="delete"
                                 disabled={loading || isPlaying || isRecording || !selectedSoundId}
                                 onPress={onDeletePress}
                                customStyle={{marginLeft: 16}}

                />
                <FileEditButton materialIconsName="delete-forever"
                                label="delete all"
                                disabled={loading || isPlaying || isRecording || (soundFiles && soundFiles.length === 0)}
                                onPress={onDeleteAllPress}
                                customStyle={{marginLeft: 16}}

                />
            </View>
        </View>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    infoPanel: {
        flex: 1,
        justifyContent: "center",
        paddingRight: 12,
        marginRight: 12,
        marginLeft: 4,
        borderRightColor: colors.disabled,
        borderRightWidth: 1,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoText: {
        fontSize: 12,
        color: colors.mainLight,
    },
    volumeWrapper: {
        paddingVertical: 4,
        backgroundColor: colors.disabled,
        borderRadius: 999,
    },
    volumeInnerWrapper: {
        height: 18,
    },
    svgWrapper: {
        position: "absolute",
        left: 15,
        top: 4,
        right: 15,
        height: 18 - 8
    },
    status: {
        marginTop: 10,
        fontSize: 14,
        color: "#FFF",
    },
    editPanel: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
    },
})