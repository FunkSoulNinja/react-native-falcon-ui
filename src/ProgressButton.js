import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';

class ProgressButton extends Component {
    animation = new Animated.Value(0);
    opacity = new Animated.Value(1);
    handlePress = () => {
        this.animation.setValue(0);
        this.opacity.setValue(1);
        Animated.timing(this.animation, {
            toValue: 1,
            duration: 1500
        }).start(({ finished }) => {
            if (finished) {
                Animated.timing(this.opacity, {
                    toValue: 0,
                    duration: 300
                }).start();
            }
        });
    };
    render() {
        const progressInterpolate = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
            extrapolate: 'clamp'
        });

        const colorInterpolate = this.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['rgb(192, 181, 250)', 'rgb(99, 71, 255)']
        });

        const progressStyle = {
            width: progressInterpolate,
            bottom: 0,
            backgroundColor: colorInterpolate,
            opacity: this.opacity
        };
        return (
            <View style={styles.container}>
                <BaseButton onPress={this.handlePress}>
                    <View style={styles.button}>
                        <View style={StyleSheet.absoluteFill}>
                            <Animated.View style={[styles.progress, progressStyle]} />
                        </View>
                        <Text style={styles.buttonText}>Progress Button</Text>
                    </View>
                </BaseButton>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        backgroundColor: '#e6537d',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 60,
        paddingVertical: 10,
        overflow: 'hidden'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 24,
        backgroundColor: 'transparent'
    },
    progress: {
        position: 'absolute',
        left: 0,
        top: 0,
        borderRadius: 2
    },
    opacityBackground: {
        // backgroundColor: "rgba(255,255,255,.5)",
    }
});

export default ProgressButton;
