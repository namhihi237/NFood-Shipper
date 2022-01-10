import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SCREEN } from '../constants';
import { Login, Register, AuthPhone, ActiveShipper, Notification, OrderShipping, Report } from '../pages';
import Tab from './tab';
const Stack = createStackNavigator();

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

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={SCREEN.LOGIN}
        screenOptions={{
          headerShown: false,
          transitionSpec: { open: config, close: config },
          gestureDirection: 'horizontal',
        }}>
        <Stack.Screen name={SCREEN.LOGIN} component={Login} />
        <Stack.Screen name={SCREEN.REGISTER} component={Register} />
        <Stack.Screen name={SCREEN.AUTH_PHONE} component={AuthPhone} />
        <Stack.Screen name={SCREEN.ACTIVE_SHIPPER} component={ActiveShipper} />
        <Stack.Screen name={SCREEN.TAB} component={Tab} />
        <Stack.Screen name={SCREEN.NOTIFICATION} component={Notification} />
        <Stack.Screen name={SCREEN.ORDER_SHIPPING} component={OrderShipping} />
        <Stack.Screen name={SCREEN.REPORT} component={Report} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
