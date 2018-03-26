import {AppRegistry,YellowBox,} from 'react-native';
import App from './src/App.js';
import Application from './src/Application';
// if (!__DEV__) {
//     global.console = {
//         info: () => {},
//         log: () => {},
//         warn: () => {},
//         debug: () => {},
//         error: () => {},
//     };
// }
YellowBox.ignoreWarnings(['Warning:','Possible'])
AppRegistry.registerComponent('Btsland', () => {
    Application.start();
    return App
});
