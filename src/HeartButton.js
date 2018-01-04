import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';

const Heart = ({ filled, style, ...props }) => {
    const centerNonFilled = (
        <View style={[StyleSheet.absoluteFill, styles.fit]}>
            <View style={[styles.leftHeart, styles.heartShape, styles.emptyFill]} />
            <View style={[styles.rightHeart, styles.heartShape, styles.emptyFill]} />
        </View>
    );
    const fillStyle = filled ? styles.filledHeart : styles.empty;

    return (
        <Animated.View {...props} style={[styles.heart, style]}>
            <View style={[styles.leftHeart, styles.heartShape, fillStyle]} />
            <View style={[styles.rightHeart, styles.heartShape, fillStyle]} />
            {!filled && centerNonFilled}
        </Animated.View>
    );
};

const getTransformationAnimation = (animation, scale, x, y, rotate, opacity) => {
    const scaleAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, scale]
    });

    const xAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, x]
    });
    const yAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, y]
    });

    const rotateAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', rotate]
    });

    const opacityAnimation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, opacity]
    });

    return {
        opacity: opacityAnimation,
        transform: [
            { scale: scaleAnimation },
            { translateX: xAnimation },
            { translateY: yAnimation },
            { rotate: rotateAnimation }
        ]
    };
};

class HeartButton extends Component {
    state = {
        liked: false,
        scale: new Animated.Value(0),
        animations: [
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0),
            new Animated.Value(0)
        ]
    };
    triggerLike = () => {
        this.setState({ liked: !this.state.liked });
        if (this.state.liked) return;
        const showAnimations = this.state.animations.map(animation => {
            return Animated.spring(animation, {
                toValue: 1,
                friction: 4,
                useNativeDriver: true
            });
        });
        const hideAnimations = this.state.animations
            .map(animation => {
                return Animated.spring(animation, {
                    toValue: 0,
                    friction: 4,
                    useNativeDriver: true
                });
            })
            .reverse();

        Animated.parallel([
            Animated.spring(this.state.scale, {
                toValue: 2,
                friction: 3,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.stagger(50, showAnimations),
                Animated.delay(100),
                Animated.stagger(50, hideAnimations)
            ])
        ]).start(() => this.state.scale.setValue(0));

        // Animated.spring(this.state.scale, {
        //     toValue: 2,
        //     friction: 3
        // }).start(() => {
        //     this.state.scale.setValue(0);
        // });
    };
    render() {
        const bouncyHeart = this.state.scale.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [1, 0.8, 1]
        });

        const heartButtonStyle = {
            transform: [{ scale: bouncyHeart }]
        };
        return (
            <View style={styles.container}>
                <View>
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[5], 0.4, 0, -280, '10deg', 0.8)
                        ]}
                    />
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[4], 0.5, 40, -120, '-45deg', 0.5)
                        ]}
                    />
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[3], 0.8, -40, -120, '-45deg', 0.3)
                        ]}
                    />
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[2], 0.3, 120, -150, '-35deg', 0.6)
                        ]}
                    />
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[1], 0.3, -120, -120, '-35deg', 0.7)
                        ]}
                    />
                    <Heart
                        filled={this.state.liked}
                        style={[
                            styles.explodeHeart,
                            getTransformationAnimation(this.state.animations[0], 0.8, 0, -60, '35deg', 0.8)
                        ]}
                    />
                    <BaseButton onPress={this.triggerLike}>
                        <Animated.View style={heartButtonStyle}>
                            <Heart filled={this.state.liked} />
                        </Animated.View>
                    </BaseButton>
                </View>
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
    explodeHeart: {
        left: 0,
        top: 0,
        position: 'absolute'
    },
    heart: {
        width: 50,
        height: 50,
        backgroundColor: 'transparent'
    },
    heartShape: {
        width: 30,
        height: 45,
        position: 'absolute',
        top: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    filledHeart: {
        backgroundColor: 'rgb(194, 155, 201)'
    },
    fit: {
        transform: [{ scale: 0.9 }]
    },
    emptyFill: {
        backgroundColor: '#fff'
    },
    empty: {
        backgroundColor: '#ccc'
    },
    leftHeart: {
        left: 5,
        transform: [{ rotate: '-45deg' }]
    },
    rightHeart: {
        right: 5,
        transform: [{ rotate: '45deg' }]
    }
});

export default HeartButton;
