import React, { useState, useRef } from 'react';
import { TextInput, StyleSheet, View } from 'react-native';
const InputAuth = (props) => {
  const [height, setHeight] = useState(1);
  const [color1, setColor1] = useState('#D7D9DB');
  const [color2, setColor2] = useState('#D7D9DB');
  const [color3, setColor3] = useState('#D7D9DB');
  const [color4, setColor4] = useState('#D7D9DB');

  const onFocus1 = () => {
    setHeight(2);
    setColor1('#F24F04');
  };
  const onFocus2 = () => {
    setHeight(2);
    setColor2('#F24F04');
  };
  const onFocus3 = () => {
    setHeight(2);
    setColor3('#F24F04');
  };
  const onFocus4 = () => {
    setHeight(2);
    setColor4('#F24F04');
  };

  const onBlur1 = () => {
    setHeight(1);
    setColor1('#D7D9DB');
  };

  const onBlur2 = () => {
    setHeight(1);
    setColor2('#D7D9DB');
  }

  const onBlur3 = () => {
    setHeight(1);
    setColor3('#D7D9DB');
  }

  const onBlur4 = () => {
    setHeight(1);
    setColor4('#D7D9DB');
  }

  return (
    <View style={styles.codeContainer}>
      <TextInput
        onChangeText={props.onChangeText1}
        style={{ ...styles.inputText, borderColor: color1, borderWidth: height }}
        onFocus={onFocus1}
        onBlur={onBlur1}
        maxLength={1}
        returnKeyType="next"
        keyboardType="number-pad"
      />
      <TextInput
        onChangeText={props.onChangeText2}
        style={{ ...styles.inputText, borderColor: color2, borderWidth: height }}
        onFocus={onFocus2}
        onBlur={onBlur2}
        maxLength={1}
        returnKeyType="next"
        keyboardType="number-pad"
        ref={props.ref2}
      />
      <TextInput
        onChangeText={props.onChangeText3}
        style={{ ...styles.inputText, borderColor: color3, borderWidth: height }}
        onFocus={onFocus3}
        onBlur={onBlur3}
        maxLength={1}
        returnKeyType="next"
        keyboardType="number-pad"
        ref={props.ref3}
      />
      <TextInput
        onChangeText={props.onChangeText4}
        style={{ ...styles.inputText, borderColor: color4, borderWidth: height }}
        onFocus={onFocus4}
        onBlur={onBlur4}
        maxLength={1}
        returnKeyType="next"
        keyboardType="number-pad"
        ref={props.ref4}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputText: {
    width: 62,
    height: 62,
    borderRadius: 15,
    fontSize: 22,
    paddingLeft: 20,
    color: '#000',
  },
  codeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },

});

export default InputAuth;