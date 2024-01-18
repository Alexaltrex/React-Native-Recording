import {StyleSheet, View, Text} from "react-native";
import React from "react";
import {commonStyles} from "../../assets/style/styles";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {getDuration} from "../../helpers/helpers";
import {colors} from "../../constants/constants";

export const PositionPanel = observer(() => {
    const {
        position, duration,
    } = useStore();

    return (
        <View style={[commonStyles.panel, {paddingVertical: 4}]}>
            <Text style={styles.text}>
                {getDuration(position) + " / " + getDuration(duration)}
            </Text>
            <View style={styles.durationWrapper}>
                <View style={[styles.durationInner, {
                    width: `${duration === 0 ? 0 : 100 * (position / duration)}%`
                }]}/>
            </View>
        </View>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    text: {
        color: "#FFF",
        marginLeft: 4,
        marginRight: 8,
    },
    durationWrapper: {
        flex: 1,
        height: 10,
        backgroundColor: colors.disabled
    },
    durationInner: {
        height: "100%",
        backgroundColor: "#FFF",
    }

})