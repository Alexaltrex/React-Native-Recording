import { StyleSheet } from "react-native";
import {colors} from "../../constants/constants";

export const commonStyles = StyleSheet.create({
    screenTitle: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 24,
        color: colors.main,
    },
    screenSubtitle: {
        marginTop: 20,
        fontWeight: "bold",
        fontSize: 18,
    },
    panel: {
        marginTop: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: colors.main,
        paddingVertical: 8,
        paddingLeft: 8,
        paddingRight: 16,
        borderRadius: 8,
    }
})
