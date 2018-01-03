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

function extractProp(children, propName, index = 0) {
    if (Array.isArray(children)) {
        return children[index].props[propName];
    }
    return children.props[propName];
}

//TODO: add ability to give shake Animation for notification
//TODO: make it more robust! refactor code, add propTypes, use flowtypes
//TODO: fix onOpen UI. make it play nicely with the layout

class MultiScreen extends Component {
    state = {
        isMoving: false,
        lastActiveScreenIndex: 0,
        open: false,
        currentScreenIndex: 0,
        currentScreenName: extractProp(this.props.children, 'screenName'),
        headerTitle: extractProp(this.props.children, 'headerTitle')
    };
    componentWillMount() {
        this.animated = new Animated.Value(200);
        this.animatedValue = 200;
        this.animated.addListener(({ value }) => {
            this.animatedValue = _.clamp(value, 0, 200);
        });
    }
    componentWillReceiveProps(nextProps) {
        //TODO: add animation when screen is removed with scrollToPage method
        // if the removed screen was the active screen
        if (
            Array.isArray(nextProps.children) &&
            Array.isArray(this.props.children) &&
            this.state.currentScreenIndex > nextProps.children.length - 1
        ) {
            this.setState(state => ({ ...state, currentScreenIndex: nextProps.children.length - 1 }));
        }

        if (Array.isArray(this.props.children) && !Array.isArray(nextProps.children)) {
            this.setState(state => ({ ...state, currentScreenIndex: 0 }));
        }
    }
    // componentDidUpdate(prevProps, prevState) {
    //     const { currentScreenIndex, lastActiveScreenIndex, open, isMoving } = this.state;
    //     if (!isMoving && !open && lastActiveScreenIndex !== currentScreenIndex && prevProps.currentScreenIndex !== currentScreenIndex) {
    //         console.log('different screen?');
    //         // this.onScreenEnter();
    //     }
    // }
    componentWillUnmount() {
        this.animated.removeAllListeners();
    }
    onPanGestureBegin() {
        this.animated.setOffset(this.animatedValue);
        this.setState(state => ({ ...state, isMoving: true }));
    }
    onGestureEvent = e => {
        const { nativeEvent } = e;
        const { translationY: dy, translationX: dx } = nativeEvent;
        this.animated.setValue(dy);
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
    onScrollEnd = ({ nativeEvent }) => {
        const screenWidth = nativeEvent.layoutMeasurement.width;
        const offsetX = nativeEvent.contentOffset.x;
        let pageIndex = Math.floor(offsetX / screenWidth);
        pageIndex = _.clamp(pageIndex, 0, this.nav.lastIndex);

        if (this.state.currentScreenIndex !== pageIndex) {
            this.setState(state => ({
                ...state,
                currentScreenIndex: pageIndex,
                currentScreenName: extractProp(this.props.children, 'screenName', pageIndex),
                headerTitle: extractProp(this.props.children, 'headerTitle', pageIndex)
            }));
        }
    };
    scrollToScreenWithName = name => {
        if (typeof name === 'number') {
            return this.scrollToPage(name);
        }
        if (!Array.isArray(this.props.children)) return;
        const screenIndex = _.findIndex(this.props.children, screen => screen.props.screenName === name);

        if (screenIndex === -1) return;

        this.scrollToPage(screenIndex);
    };
    open = () => {
        return new Promise(resolve => {
            Animated.timing(this.animated, {
                ...openConfig
            }).start(() => {
                this.setState(state => ({ ...state, open: true, isMoving: false, lastActiveScreenIndex: state.currentScreenIndex }), resolve);
            });
        });
    };
    close = () => {
        return new Promise(resolve => {
            Animated.timing(this.animated, {
                ...closeConfig
            }).start(() => {
                this.setState(
                    state => ({
                        ...state,
                        open: false,
                        isMoving: false
                    }),
                    resolve
                );
            });
        });
    };
    get nav() {
        return {
            isOpen: this.state.open,
            open: this.open,
            close: this.close,
            back: () => this.scrollToPage(this.state.lastActiveScreenIndex),
            headerTitle: this.state.headerTitle,
            goToIndex: this.scrollToPage,
            go: this.scrollToScreenWithName,
            lastIndex: Array.isArray(this.props.children) ? this.props.children.length - 1 : 1
        };
    }
    renderHeader = () => {
        return React.cloneElement(this.props.header, {
            nav: this.nav
        });
    };
    renderScreens() {
        if (!this.props.children) return null;

        const scale = this.animated.interpolate({
            inputRange,
            outputRange: [0.5, 1],
            extrapolate: 'clamp'
        });

        const activeScreenStyle = {
            transform: [{ scale }]
        };
        const inactiveScreenStyle = {
            backgroundColor: 'grey',
            transform: [{ scale: 0.5 }]
        };

        if (!Array.isArray(this.props.children)) {
            return (
                <Animated.View key={0} style={[styles.screen, activeScreenStyle]}>
                    <BaseButton enabled={this.state.open ? true : false} onPress={this.close} key={0}>
                        {this.props.children}
                    </BaseButton>
                </Animated.View>
            );
        }

        return _.map(this.props.children, (screen, index) => {
            if (!screen) return null;
            const isActive = this.state.currentScreenIndex === index;

            if (!isActive && !this.props.keepMounted) {
                return <Animated.View key={index} style={[styles.screen, inactiveScreenStyle]} />;
            }

            return (
                <Animated.View key={index} style={[styles.screen, isActive ? activeScreenStyle : inactiveScreenStyle]}>
                    <BaseButton enabled={this.state.open ? true : false} onPress={this.close} key={index}>
                        {React.cloneElement(screen, {
                            nav: this.nav
                        })}
                    </BaseButton>
                </Animated.View>
            );
        });
    }
    scrollToPage = async index => {
        if (typeof index !== 'number') return;
        const x = SCREEN_WIDTH * index;
        await this.open();
        await new Promise(resolve => setTimeout(() => resolve(), 100));
        this.scrollViewRef.scrollTo({ x, animated: true });
        await new Promise(resolve => setTimeout(() => resolve(), 400));
        // debugger;
        this.close();
    };
    renderUI() {
        if (!this.props.topBar) return;
        const opacity = this.animated.interpolate({
            inputRange: [0, 100, 200],
            outputRange: [1, 0, 0]
        });
        if (this.state.isMoving || this.state.open) {
            const topBarStyle = {
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
                position: 'absolute',
                height: '20%',
                width: '100%',
                top: 0,
                opacity
            };
            const bottomBarStyle = {
                // backgroundColor: 'blue',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                position: 'absolute',
                height: '20%',
                width: '100%',
                bottom: 0,
                opacity
            };
            return [
                <Animated.View key={1} style={topBarStyle}>
                    {this.props.topBar}
                </Animated.View>,
                <Animated.View key={2} style={bottomBarStyle}>
                    {this.props.bottomBar}
                </Animated.View>
            ];
        }
    }
    // onScreenEnter() {
    //     if (!this.props.onScreenEnter) return;
    //     this.props.onScreenEnter(this.state.currentScreenName || this.state.headerTitle || this.state.currentScreenIndex);
    // }
    render() {
        console.log(this.state.lastActiveScreenIndex, this.state.currentScreenIndex);
        return (
            <View style={styles.container}>
                <View style={{ width: '100%', height: '100%' }}>
                    {this.renderHeader()}
                    <PanGestureHandler
                        enabled={this.props.enableSwipe}
                        minPointers={this.props.minPointers}
                        onGestureEvent={this.onGestureEvent}
                        onHandlerStateChange={this.onHandlerStateChange}
                    >
                        <ScrollView
                            ref={ref => (this.scrollViewRef = ref)}
                            scrollEnabled={this.state.open}
                            onMomentumScrollEnd={this.onScrollEnd}
                            pagingEnabled
                            horizontal
                            style={[styles.screenContainer, { backgroundColor: this.props.backgroundColor }]}
                        >
                            {this.renderScreens()}
                        </ScrollView>
                    </PanGestureHandler>
                    {/* {this.renderUI()} */}
                </View>
            </View>
        );
    }
}

MultiScreen.defaultProps = {
    backgroundColor: 'rgb(64, 64, 64)',
    keepMounted: true,
    minPointers: 3,
    enableSwipe: true
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
        // backgroundColor: 'rgb(144, 144, 144)'
    },
    screenContainer: {
        width: '100%',
        height: '100%'
    }
});

export default MultiScreen;
