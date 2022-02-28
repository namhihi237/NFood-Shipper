import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Button, Switch } from "native-base";
import { Badge } from 'react-native-elements';
// import { Text } from 'native-base';
import { storageUtils } from '../utils'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SCREEN } from '../constants';
import { SUBSCRIPTION, QUERY, MUTATION } from "../graphql";
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
const Header = (props) => {
  const navigation = useNavigation();

  const onPress = props.onPress ? props.onPress : () => navigation.navigate(SCREEN.HOME);
  const [count, setCount] = React.useState(2);


  const { data } = useSubscription(SUBSCRIPTION.GET_NUMBER_OF_NOTIFICATIONS, {
    variables: {
      userType: 'shipper'
    },
    onSubscriptionData: ({ client, subscriptionData }) => {
      setCount(subscriptionData.data.numberOfNotifications)
    },
  });


  useQuery(QUERY.GET_NUMBER_OF_NOTIFICATIONS, {
    fetchPolicy: 'network-only',
    variables: {
      userType: 'shipper'
    },
    onCompleted: (data) => {
      setCount(data.getNumberOfNotifications)
    }
  });

  const [resetNumberOfNotifications] = useMutation(MUTATION.RESET_NUMBER_OF_NOTIFICATIONS, {
    variables: {
      userType: 'shipper'
    },
    onCompleted: (data) => {
      setCount(0)
    }
  });

  return (
    <View style={styles.header}>
      <TouchableWithoutFeedback onPress={onPress}>
        <FontAwesome5 name={props.icon || "home"} size={wp('5%')} />
      </TouchableWithoutFeedback>
      <Text style={styles.text}>{props.title}</Text>

      <TouchableWithoutFeedback onPress={() => {
        navigation.navigate(SCREEN.NOTIFICATION);
        resetNumberOfNotifications();
      }}>
        <View>
          {count != 0 ? (
            <Badge
              value={`${count}`}
              status="error"
              containerStyle={{ position: 'absolute', top: -6, right: -10 }}
            />
          ) : null}
          <FontAwesome5 name="bell" size={wp('5%')} color="white" style={styles.icon || 'home'} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#F24F04',
  },
  buttonTitle: {
    flexDirection: 'row',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Dongle-Bold',
    fontSize: hp('3.5%'),
  },

  right: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: wp('18%'),
  },

});