import React from 'react';
import { ActivityIndicator, StyleSheet, View, Modal, Text } from 'react-native';

const Loading = (props) => {
  const justifyContent = props.message ? 'space-around' : 'center';
  return (
    <Modal visible={props.status || false} transparent={true} animationType={'none'}>
      <View style={styles.modalBackground}>
        <View style={{ ...styles.activityIndicatorWrapper, justifyContent }}>
          <ActivityIndicator size="large" color="#00ff00" />
          {props.message ? <Text style={{ color: "#000" }}>{props.message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
};
export default Loading;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
  },

});
