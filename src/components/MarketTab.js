import MyMarket from "./MyMarket";
import BTCMarket from "./BTCMarket";
import CNYMarket from "./CNYMarket";
import USDMarket from "./USDMarket";
import {TabNavigator} from "react-navigation";

const MarketTab = TabNavigator({
    MY: {screen: MyMarket},
    CNY: {screen: CNYMarket},
    USD: {screen: USDMarket},
    BTC: {screen: BTCMarket,}
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    removeClippedSubviews: true,
    initialRouteName: 'MY',
    activeTintColor: 'transparent',
    tabBarOptions: {
      labelStyle: {
        fontSize: 15,
        marginBottom: 3,
        fontWeight: 'bold',
        lineHeight: 40,
      },
      style: {
        height: 40,
        backgroundColor: '#F0F0F0',
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3'
      },
    }
  })

export default MarketTab;

