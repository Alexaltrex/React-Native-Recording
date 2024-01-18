import {Pressable, StyleProp, StyleSheet, Text, PressableProps, ViewStyle} from "react-native";
import React, {FC} from "react";
import {MaterialIcons} from '@expo/vector-icons';
import {colors} from "../constants/constants";

interface IFileEditButton extends PressableProps {
    materialIconsName: string
    label: string
    customStyle?: StyleProp<ViewStyle>
}

export const FileEditButton: FC<IFileEditButton> = ({
                                                          materialIconsName,
                                                          label,
                                                        customStyle,
                                                          ...pressableProps
                                                      }) => {
    const { disabled } = pressableProps

    return (
        <Pressable style={[styles.editPanelButton, Boolean(customStyle) && customStyle]}
                   {...pressableProps}
        >
            <MaterialIcons name={materialIconsName}
                           size={24}
                           color={disabled ? colors.disabled : colors.enabled}
            />
            <Text style={[styles.label, {
                color: disabled ? colors.disabled : colors.enabled
            }]}>
                {label}
            </Text>
        </Pressable>
    )
}

//========= STYLES =========//
const styles = StyleSheet.create({
    editPanelButton: {
        alignItems: "center",
        justifyContent: "center",
        //backgroundColor: "green"
    },
    label: {
        fontSize: 12
    }
})