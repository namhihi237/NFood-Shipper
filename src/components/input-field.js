import React, { useState } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const InputField = (props) => {
  const [height, setHeight] = useState(1);
  const [color, setColor] = useState('#D7D9DB');

  const onFocus = () => {
    setHeight(2);
    setColor('#F24F04');
  };

  const onBlur = () => {
    setHeight(1);
    setColor('#D7D9DB');
  };

  const width = props.width ? wp(props.width) : wp('80%');
  return (
    <View style={{ ...styles.inputView, borderColor: color, borderWidth: height, width }}>
      <FontAwesome5 name={props.iconName} style={styles.icon} />
      <TextInput
        onChangeText={props.onChangeText}
        style={styles.inputText}
        placeholder={props.placeholder}
        placeholderTextColor="#a89292"
        onFocus={onFocus}
        onBlur={onBlur}
        value={props.value}
        secureTextEntry={props.secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputView: {
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 15,
    paddingLeft: 10,
    marginBottom: 10,
  },

  inputText: {
    color: '#000',
    width: wp('70%'),
    fontSize: 17,
  },
  icon: {
    fontSize: 22,
  },
});

export default InputField;