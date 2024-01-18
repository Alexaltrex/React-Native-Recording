import {commonStyles} from "../../assets/style/styles";
import {StyleSheet, View, Text, Animated, Easing} from "react-native";
import React, {useEffect, useRef} from "react";
import {SvgIcons} from "../SvgIcons";
import Slider from "@react-native-community/slider";
import {colors} from "../../constants/constants";
import {observer} from "mobx-react-lite";
import {useStore} from "../../store/store";
import {getNameWithoutExtension} from "../../helpers/helpers";

export const VolumePanel = observer(() => {
    const {
        volume, setVolume,
        selectedSound, selectedSoundId,
        soundFiles,
    } = useStore();


    const onValueChange = (value: number) => setVolume(value);

    const onSlidingComplete = async () => {
        try {
            if (selectedSound) {
                await selectedSound.setStatusAsync({
                    volume,
                })
            }
        } catch (e) {
            console.log(e)
        }

    }

    const DURATION = 10000;
    const animParamLeft = useRef(new Animated.Value(0)).current;
    const animParamRight = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const animationLeft = Animated.sequence([
            Animated.timing(animParamLeft, {
                toValue: -1,
                duration: DURATION,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }),
            Animated.timing(animParamLeft, {
                toValue: 1,
                duration: 0,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }),
            Animated.timing(animParamLeft, {
                toValue: 0,
                duration: DURATION,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }),
        ])
        const animationRight = Animated.sequence([
            Animated.timing(animParamRight, {
                toValue: -1,
                duration: 2 * DURATION,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }),
            Animated.timing(animParamRight, {
                toValue: 1,
                duration: 0,
                easing: Easing.in(Easing.linear),
                useNativeDriver: false,
            }),
        ]);
        Animated.loop(Animated.parallel(
            [
                animationLeft,
                animationRight
            ]
        ), {
            iterations: -1
        }).start()
    }, [])

    const text = (soundFiles && selectedSoundId && soundFiles.findIndex(el => el.id === selectedSoundId) !== -1)
        ? getNameWithoutExtension(soundFiles[soundFiles.findIndex(el => el.id === selectedSoundId)].name)
        : ""

    return (
        <View style={commonStyles.panel}>
            <View style={styles.nameWrapper}>
                <Animated.View style={[
                    styles.wrapperInnerLeft,
                    {
                        left: animParamLeft.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ["-100%", "100%"]
                        })
                    }
                ]}>
                    <Text style={styles.text}>
                        {text}
                    </Text>
                </Animated.View>

                <Animated.View style={[
                    styles.wrapperInnerLeft,
                    {
                        left: animParamRight.interpolate({
                            inputRange: [-1, 1],
                            outputRange: ["-100%", "100%"]
                        })
                    }
                ]}>
                    <Text style={styles.text}>
                        {text}
                    </Text>
                </Animated.View>

            </View>

            <View style={styles.volumeWrapper}>
                <View style={styles.volumeInnerWrapper}>
                    <View style={styles.svgWrapper}>
                        <SvgIcons name="volume"
                                  width={"100%"}
                                  height={"100%"}
                                  color={"#999"}
                        />
                    </View>

                    <Slider style={{width: "100%"}}
                        //disabled={disabled}
                            value={0.5} // Entered once at the beginning still acts as an initial value
                            step={0.01} // Step value of the slider
                            onValueChange={onValueChange}
                            minimumValue={0} // Initial minimum value of the slider. Default value is 0
                            maximumValue={1} // Initial maximum value of the slider. Default value is 1
                            minimumTrackTintColor="transparent" // The color used for the track to the left of the button
                            maximumTrackTintColor="transparent" // The color used for the track to the right of the button. Overrides the default gray gradient image on iOS
                            thumbTintColor={"#FFF"}
                            onSlidingComplete={onSlidingComplete}

                    />
                </View>
            </View>
        </View>
    )
})

//========= STYLES =========//
const styles = StyleSheet.create({
    nameWrapper: {
        width: "50%",
        height: "100%",
        backgroundColor: colors.mainDark,
        marginRight: 4,
        overflow: "hidden",
        borderRadius: 2,
    },
    wrapperInnerLeft: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        justifyContent: "center"
    },
    text: {
        textAlign: "center",
        color: colors.playing
    },
    volumeWrapper: {
        flex: 1,
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
})