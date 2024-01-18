import React, {FC} from "react";
import {PressableProps, ViewStyle, StyleSheet, Pressable, View, Text} from "react-native";
import {colors} from "../constants/constants";

interface IPressableCustom extends PressableProps {
    style?: ViewStyle
    labelStyle?: ViewStyle
    label: string
}

export const PressableCustom: FC<IPressableCustom> = ({
                                                          style,
                                                          labelStyle,
                                                          label,
                                                          ...props
                                                      }) => {
    return (
        <Pressable style={[
            styles.pressable,
            props.disabled && styles.pressableDisabled,
            Boolean(style) && style
        ]}
                   {...props}
        >

            <View style={styles.labelWrapper}>
                <Text style={[styles.label, Boolean(labelStyle) && labelStyle]}>
                    {label}
                </Text>
            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 4,
        backgroundColor: colors.disabled, //"royalblue",
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    pressableDisabled: {
        backgroundColor: "darkgrey",
    },
    labelWrapper: {
        position: "relative"
    },
    label: {
        fontWeight: "bold",
        textAlign: "center",
        color: "#FFF",
        fontSize: 16,
        lineHeight: 20,
    },
})
