import {useEffect, useRef} from "react";
import {Animated} from "react-native";

const DURATION = 750;

export const useRecordAnim = (isRecording: boolean): {animParam: Animated.Value} => {
    const animParam = useRef(new Animated.Value(0)).current
    useEffect(() => {
        const animLoop = Animated.loop(
            Animated.sequence(([
                Animated.timing(animParam, {
                    toValue: 1,
                    duration: DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(animParam, {
                    toValue: 0,
                    duration: DURATION,
                    useNativeDriver: true,
                }),
            ])),
            {iterations: -1}
        );
        if (isRecording) {
            animLoop.start()
        } else {
            animLoop.stop();
        }
    }, [isRecording])
    return ({ animParam })
}