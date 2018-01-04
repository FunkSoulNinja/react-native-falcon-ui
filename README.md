# react-native-falcon-ui
A project folder for components I will eventually have a seperate git repo for.

## Navigators
### MultiScreen
A navigator component inspired by macOS.
Swipe up with 3 fingers (changed with minPointers prop) to open up the navigator and then swipe horizontally to change screens.
Swipe down or press on the screen to close the navigator.

#### MultiScreen props
| name          | type          |default| description|
| ------------- |:-------------:| -----:|-----------:|
| minPointers   | Integer       | 3     | fingers needed for open/close swipe gesture |
| keepMounted   | Boolean       | true  | keep the inactive screens mounted |
| header        | Component     | null  | header     |

#### MultiScreen children props
| name          | type          |default| description|
| ------------- |:-------------:| -----:|-----------:|
| headerTitle   | String        | ""    | title to render in header |
| screenName    | String        | ""    | allows for routing with name |
| header        |   Component   | null  | a header component to render |

##### The header and child components all have a nav prop object with these properties:

| prop          | type          |description|
| ------------- |:-------------:| -----:|
| isOpen        | Boolean       | shows if navigator is open |
| headerTitle   | String        | title of active screen |
| open          | function      | opens the navigator  |
| close         | function      | closes the navigator  |
| back          | function      | open the last active screen  |
| goToIndex     | function      | go to a screen at a given index  |
| go            | function      | go to a screen with a given screenName or index  |
| lastIndex     | Integer       | index of last screen |
