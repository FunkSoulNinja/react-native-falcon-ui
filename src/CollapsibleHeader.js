import React, { Component } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

import { ScrollView, BaseButton } from 'react-native-gesture-handler';
import eggHead from '../egghead.png';

class CollapsibleHeader extends Component {
    animated = new Animated.Value(0);

    render() {
        const hideHeaderInterpolate = this.animated.interpolate({
            inputRange: [0, 250],
            outputRange: [50, 0],
            extrapolate: 'clamp'
        });

        const fontInterpolate = this.animated.interpolate({
            inputRange: [0, 250],
            outputRange: [24, 30],
            extrapolate: 'clamp'
        });

        const opacityInterpolate = this.animated.interpolate({
            inputRange: [0, 250],
            outputRange: [1, 0]
        });

        const collapseInterpolate = this.animated.interpolate({
            inputRange: [0, 250],
            outputRange: [50, 0],
            extrapolate: 'clamp'
        });

        const fadeButtonStyle = {
            opacity: opacityInterpolate,
            height: collapseInterpolate
        };

        const headerStyle = {
            width: hideHeaderInterpolate,
            height: hideHeaderInterpolate
        };

        const titleStyle = {
            fontSize: fontInterpolate
        };
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Animated.Image source={eggHead} style={[styles.image, headerStyle]} />
                    <Animated.Text style={[styles.titleStyle, titleStyle]}>Egghead</Animated.Text>
                    <Animated.View style={[styles.buttons, fadeButtonStyle]}>
                        <BaseButton onPress={() => console.log('pressed 1')} style={styles.button}>
                            <Text>Button 1</Text>
                        </BaseButton>
                        <BaseButton onPress={() => console.log('pressed 2')} style={styles.button}>
                            <Text>Button 2</Text>
                        </BaseButton>
                    </Animated.View>
                </View>
                <View style={styles.scrollView}>
                    <ScrollView
                        scrollEventThrottle={16}
                        onScroll={Animated.event([
                            { nativeEvent: { contentOffset: { y: this.animated } } }
                        ])}
                    >
                        <View style={styles.fakeContent}>
                            <Text style={styles.fakeText}>Top</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    titleStyle: {
        marginBottom: 10
    },
    fakeContent: {
        height: 1000,
        backgroundColor: '#4A89DC'
    },
    fakeText: {
        padding: 15,
        textAlign: 'center',
        color: '#FFF'
    },
    buttons: {
        flexDirection: 'row'
    },
    image: {
        width: 50,
        height: 50
    },
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        paddingTop: 30,
        alignItems: 'center'
    },
    scrollView: {
        flex: 1
    }
});

export default CollapsibleHeader;
