import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Animated, Easing, Dimensions } from 'react-native';
import { PanGestureHandler, State, BaseButton, ScrollView } from 'react-native-gesture-handler';
import _ from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const SWIPE_Y_THRESHOLD = 90;
const VELOCITY_THRESHOLD = 1000;
const inputRange = [0, 200];
const timing = {
    easing: Easing.ease,
    duration: 200
};

const closeConfig = {
    ...timing,
    toValue: 200
};
const openConfig = {
    ...timing,
    toValue: -200
};

//TODO: add ability to give shake Animation for notification
//TODO: allow for a header/footer to always be shown
//TODO: add hidden sub header/footer that is shown when zoomed out (open) || additional data
//TODO: add ability to take in onScreenPress function as a prop.

class MultiScreen extends Component {
    state = {
        open: false,
        isOpening: false,
        currentScreenIndex: 0
    };
    componentWillMount() {
        this.animated = new Animated.Value(200);
        this.animatedValue = 200;
        this.animated.addListener(({ value }) => {
            this.animatedValue = _.clamp(value, 0, 200);
        });
    }
    componentWillUnmount() {
        this.animated.removeAllListeners();
    }
    onPanGestureBegin() {
        this.setState(state => ({ ...state, isOpening: true }));
        this.animated.setOffset(this.animatedValue);
    }
    onGestureEvent = e => {
        const { nativeEvent } = e;
        const { translationY } = nativeEvent;
        this.animated.setValue(translationY);
    };
    onPanGestureEnd = ({ translationY: dy, velocityY: vy }) => {
        if (this.state.open) {
            if (dy > SWIPE_Y_THRESHOLD || vy > VELOCITY_THRESHOLD) {
                // swipe down
                this.close();
            } else {
                this.open();
            }
        } else {
            if (dy < -SWIPE_Y_THRESHOLD || vy < -VELOCITY_THRESHOLD) {
                // swipe up
                this.open();
            } else {
                this.close();
            }
        }
    };
    onHandlerStateChange = ({ nativeEvent }) => {
        const { state } = nativeEvent;
        if (state === State.BEGAN) {
            this.onPanGestureBegin();
        } else if (state === State.END) {
            this.onPanGestureEnd(nativeEvent);
        }
    };
    renderHeader() {
        return (
            <View style={styles.header}>
                <BaseButton onPress={this.state.open ? this.close : this.open}>
                    <Text style={{ fontSize: 36 }}>{this.state.open ? 'close' : 'open'}</Text>
                </BaseButton>
            </View>
        );
    }
    onScreenPress(screenIndex) {
        console.log('pressed: ' + screenIndex);
        this.setState(
            state => ({ ...state, currentScreenIndex: screenIndex }),
            () => {
                Animated.timing(this.animated, {
                    ...closeConfig
                }).start(this.setState(state => ({ ...state, open: false, isOpening: false })));
            }
        );
    }
    onScrollEnd = ({ nativeEvent }) => {
        const screenWidth = nativeEvent.layoutMeasurement.width;
        const offsetX = nativeEvent.contentOffset.x;
        const pageIndex = Math.floor(offsetX / screenWidth);

        if (this.state.currentScreenIndex !== pageIndex) {
            this.setState(state => ({ ...state, currentScreenIndex: pageIndex }));
        }
    };
    open = () => {
        this.setState(
            state => ({ ...state, isOpening: true }),
            () => {
                Animated.timing(this.animated, {
                    ...openConfig
                }).start(() => {
                    this.setState(state => ({ ...state, open: true, isOpening: false }));
                });
            }
        );
    };
    close = () => {
        this.setState(
            state => ({ ...state, isOpening: true }),
            () => {
                Animated.timing(this.animated, {
                    ...closeConfig
                }).start(() => {
                    this.setState(state => ({ ...state, open: false, isOpening: false }));
                });
            }
        );
    };
    renderScreens() {
        if (!this.props.children) return null;

        const scale = this.animated.interpolate({
            inputRange,
            outputRange: [0.5, 1],
            extrapolate: 'clamp'
        });

        const opacity = this.animated.interpolate({
            inputRange: [0, 100, 100.99, 200],
            outputRange: [1, 0, 0, 0],
            extrapolate: 'clamp'
        });

        // const width = this.animated.interpolate({
        //     inputRange,
        //     outputRange: [SCREEN_WIDTH * 0.5, SCREEN_WIDTH],
        //     extrapolate: 'clamp'
        // });

        const wrapperStyle = {
            // width,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const activeScreenStyle = {
            transform: [{ scale }]
        };
        const inactiveScreenStyle = {
            opacity,
            transform: [{ scale: 0.5 }]
        };

        return _.map(this.props.children, (screen, index) => {
            const isActive = this.state.currentScreenIndex === index;

            // if (!isActive && !this.state.isOpening && !this.state.open) {
            //     console.log('ping');
            //     return <Animated.View key={index} />;
            // }

            return (
                <Animated.View key={index} style={wrapperStyle}>
                    <Animated.View
                        key={index}
                        style={[styles.screen, isActive ? activeScreenStyle : inactiveScreenStyle]}
                    >
                        <BaseButton
                            enabled={this.state.open ? true : false}
                            onPress={() => this.onScreenPress(index)}
                            key={index}
                        >
                            {screen}
                        </BaseButton>
                    </Animated.View>
                </Animated.View>
            );
        });
    }
    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <PanGestureHandler
                    minPointers={3}
                    onGestureEvent={this.onGestureEvent}
                    onHandlerStateChange={this.onHandlerStateChange}
                >
                    <ScrollView
                        ref={ref => (this.scrollViewRef = ref)}
                        scrollEnabled={this.state.open}
                        onMomentumScrollEnd={this.onScrollEnd}
                        pagingEnabled
                        horizontal
                        style={[
                            styles.screenContainer,
                            { backgroundColor: this.props.backgroundColor }
                        ]}
                    >
                        {this.renderScreens()}
                    </ScrollView>
                </PanGestureHandler>
            </View>
        );
    }
}

MultiScreen.defaultProps = {
    backgroundColor: 'rgb(64, 64, 64)'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    screen: {
        width: SCREEN_WIDTH,
        height: '100%'
    },
    screenContainer: {
        width: '100%',
        height: '100%'
    },
    header: {
        backgroundColor: 'rgb(43, 143, 139)',
        width: '100%'
    }
});

export default MultiScreen;
