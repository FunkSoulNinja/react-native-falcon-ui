import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Animated,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Easing,
    findNodeHandle
} from 'react-native';

import TextInputState from 'react-native/lib/TextInputState';

function focusTextInput(ref) {
    try {
        TextInputState.focusTextInput(findNodeHandle(ref));
    } catch (e) {
        console.log("Couldn't focus text input: ", e.message);
    }
}

class AnimatedInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCompletedMessage: false,
            open: false
        };

        this.animated = new Animated.Value(0);
        this.animatedOpacity = new Animated.Value(0);
    }
    open = () => {
        Animated.timing(this.animated, {
            toValue: 1,
            duration: 250,
            easing: Easing.ease
        }).start(() => {
            this.setState({ open: true }, () => {
                focusTextInput(this.inputRef);
                Animated.timing(this.animatedOpacity, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.ease
                }).start();
            });
        });
    };
    close = () => {
        Animated.timing(this.animatedOpacity, {
            toValue: 0,
            duration: 300,
            ease: Easing.ease
        }).start(() => {
            this.setState({ open: false, showCompletedMessage: false }, () => {
                Animated.timing(this.animated, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.ease
                }).start();
            });
        });
    };
    handlePress = () => {
        this.open();
        this.props.onOpen && this.props.onOpen();
    };
    handleFinishPress = () => {
        this.setState({ showCompletedMessage: true }, () => {
            Animated.sequence([
                Animated.timing(this.animatedOpacity, {
                    toValue: 0,
                    duration: 300
                }),
                Animated.timing(this.animated, {
                    toValue: 0,
                    duration: 300
                }),
                Animated.delay(500)
            ]).start(() => this.setState({ showCompletedMessage: false, open: false }));
            this.props.onComplete && this.props.onComplete();
        });
    };
    onBlur = () => {
        this.setState({ open: false });
        Animated.timing(this.animated, {
            toValue: 0,
            duration: 300
        }).start();
    };
    componentWillUnmount() {
        this.inputRef = null;
    }
    renderFinishButton() {
        if (!this.props.finishButtonText || !this.state.open) return;

        const inputButtonInterpolate = this.animated.interpolate({
            inputRange: [0, 0.6, 1],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });
        const inputButtonStyle = {
            opacity: this.animatedOpacity,
            transform: [{ scale: inputButtonInterpolate }]
        };

        return (
            <TouchableOpacity onPress={this.handleFinishPress}>
                <Animated.View style={[styles.inputButton, inputButtonStyle]}>
                    <Text style={styles.finishButtonText}>{this.props.finishButtonText}</Text>
                </Animated.View>
            </TouchableOpacity>
        );
    }
    render() {
        const { showCompletedMessage } = this.state;

        const reverseInterpolate = this.animated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });
        const widthInterpolate = this.animated.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ['50%', '90%', '100%'],
            extrapolate: 'clamp'
        });
        const buttonWrapStyle = {
            width: widthInterpolate
        };

        const inputScaleInterpolate = this.animated.interpolate({
            inputRange: [0, 0.5, 0.6],
            outputRange: [0, 0, 1],
            extrapolate: 'clamp'
        });

        const inputScaleStyle = {
            transform: [{ scale: inputScaleInterpolate }]
        };
        const buttonTextStyle = {
            flexDirection: 'row',
            opacity: reverseInterpolate
        };
        const finishMessageStyle = {
            transform: [{ scale: reverseInterpolate }]
        };
        return (
            <View style={[styles.container, { backgroundColor: this.props.backgroundColor }]}>
                {this.props.left}
                <TouchableWithoutFeedback onPress={this.handlePress}>
                    <Animated.View style={[styles.buttonWrap, buttonWrapStyle]}>
                        {!showCompletedMessage && (
                            <Animated.View
                                style={[StyleSheet.absoluteFill, styles.inputWrap, inputScaleStyle]}
                            >
                                {this.state.open && (
                                    <TextInput
                                        selectTextOnFocus
                                        onChangeText={this.props.onChangeText}
                                        placeholder={
                                            this.props.placeholder || this.props.buttonLabel
                                        }
                                        style={styles.textInput}
                                        onSubmitEditing={this.complete}
                                        onBlur={this.onBlur}
                                        ref={ref => (this.inputRef = ref)}
                                        underlineColorAndroid="transparent"
                                    />
                                )}
                                {this.renderFinishButton()}
                            </Animated.View>
                        )}
                        {!showCompletedMessage && (
                            <Animated.View style={buttonTextStyle}>
                                {!!this.props.icon && this.props.icon}
                                <Text style={styles.onCompleteText}>{this.props.buttonLabel}</Text>
                            </Animated.View>
                        )}
                        {showCompletedMessage && (
                            <Animated.View style={finishMessageStyle}>
                                <Text style={styles.onCompleteText}>
                                    {this.props.onCompleteText}
                                </Text>
                            </Animated.View>
                        )}
                    </Animated.View>
                </TouchableWithoutFeedback>
                {this.props.right}
            </View>
        );
    }
}
AnimatedInput.defaultProps = {
    buttonLabel: 'buttonLabel',
    finishText: '',
    backgroundColor: 'transparent'
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonWrap: {
        backgroundColor: '#FFF',
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    onCompleteText: {
        color: `rgb(64, 64, 64)`,
        fontWeight: 'bold',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    inputWrap: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15
    },
    textInput: {
        flex: 4
    },
    inputButton: {
        backgroundColor: `rgb(64, 64, 64)`,
        flex: 1,
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    finishButtonText: {
        color: '#FFF'
    }
});
export default AnimatedInput;
