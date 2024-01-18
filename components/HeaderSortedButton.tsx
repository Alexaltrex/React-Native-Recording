import {Pressable, StyleSheet, Text, ViewStyle, StyleProp} from "react-native";
import React, {FC} from "react";
import {SortedEnum} from "../types/types";
import {colors} from "../constants/constants";
import {MaterialIcons} from "@expo/vector-icons";

interface IHeaderSortedButton {
    label: string
    sorted: SortedEnum
    sortedDirection: number
    currentSorted: SortedEnum
    onPress: () => void
    style?: StyleProp<ViewStyle>
}

export const HeaderSortedButton: FC<IHeaderSortedButton> = ({
                                                                label,
                                                                sorted,
                                                                sortedDirection,
                                                                currentSorted,
                                                                onPress,
                                                                style
                                                            }) => {


    return (
        <Pressable style={[styles.button, style]}
                   onPress={onPress}
        >
            <Text style={[styles.label, sorted === currentSorted && styles.labelSelected]}>
                {label}
            </Text>

            <MaterialIcons name="arrow-upward"
                           size={14}
                           color={sorted === currentSorted ? colors.playing : "#FFF"}
                           style={{
                               marginLeft: 2,
                               transform: [{
                                   rotate: (sorted === currentSorted && sortedDirection === -1) ? "180deg" : "0deg"
                               }]
                           }}
            />

        </Pressable>
    )
}

//========= STYLES =========//
const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
    },
    label: {
        fontSize: 12,
        color: "#FFF",
    },
    labelSelected: {
        color: colors.playing,
    }
})