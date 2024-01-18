import React, {FC} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ScrollView, View} from "react-native";

interface ISafeScrollView {
    children: JSX.Element | JSX.Element[]
}

export const SafeScrollView: FC<ISafeScrollView> = ({children}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={{
            flex: 1,
            paddingBottom: insets.bottom,
        }}>
            <ScrollView
                contentContainerStyle={{
                    padding: 10,
                    minHeight: "100%"
                }}
            >
                {children}
            </ScrollView>
        </View>
    )
}
