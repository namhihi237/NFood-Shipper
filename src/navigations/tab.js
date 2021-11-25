import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabBar } from '../components';
import { SCREEN } from '../constants';
import { Notification, Home, Profile, Wallet, Order } from '../pages';
const Tab = createBottomTabNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};


function TabHome() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />}
      initialRouteName={SCREEN.HOME}
      screenOptions={{
        headerShown: false,
        transitionSpec: { open: config, close: config },
        gestureDirection: 'horizontal',
      }}
    >
      <Tab.Screen name={SCREEN.HOME} component={Home} options={{ icon: 'home' }} />
      <Tab.Screen name={SCREEN.ORDER} component={Order} options={{ icon: 'list-ol' }} />
      <Tab.Screen name={SCREEN.WALLET} component={Wallet} options={{ icon: 'wallet' }} />
      <Tab.Screen name={SCREEN.PROFILE} component={Profile} options={{ icon: 'user' }} />

    </Tab.Navigator>
  );
}

export default TabHome;