import React, {FC} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View, ViewStyle} from "react-native";

interface ISafeView {
    children: JSX.Element | null | (JSX.Element | null)[]
    style?: ViewStyle
}

export const SafeView: FC<ISafeView> = ({children, style}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom,
        }}>
            <View style={[styles.innerStyle, Boolean(style) && style]}>
                {children}
            </View>
        </View>
    )
}

//========= STYLE =========//
const styles = StyleSheet.create({
    innerStyle: {
        flex: 1,
        padding: 15
    }
})
