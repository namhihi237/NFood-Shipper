import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Badge } from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const TabBar = ({ state, descriptors, navigation }) => {

  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const icon = options.icon;
        const isFocused = state.index === index;

        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
          if (route.name === 'Notification') {

          }
        };

        return (
          <TouchableOpacity onPress={onPress} style={styles.button} key={route.key}>
            <View style={isFocused ? styles.focus : styles.noFocus}>
              {options.icon == 'bell' && count != 0 ? (
                <Badge
                  value={`${count}`}
                  status="error"
                  containerStyle={{ position: 'absolute', top: -1, right: -1 }}
                />
              ) : null}
              <FontAwesome5
                name={icon}
                style={{
                  ...styles.icon,
                  color: isFocused ? '#E5512F' : '#fff',
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C1D26',
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    width: wp('100%'),
  },
  icon: {
    fontSize: 22,
    color: '#E5512F',
  },
  button: {
    flex: 1,

    alignItems: 'center',
  },
  buttonFocus: {
    flex: 1,
    alignItems: 'center',
  },
  focus: {
    backgroundColor: '#d9d2c5',
    alignItems: 'center',
    borderRadius: 30,
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
  noFocus: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 40,
  },
});
export default TabBar;