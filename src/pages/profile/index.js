import { Text, FormControl, View, Modal, Button, Input } from "native-base";
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@apollo/client';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Header, Toast } from '../../components';
import { SCREEN } from "../../constants";
import { QUERY, MUTATION } from '../../graphql';
import { moneyUtils, storageUtils } from '../../utils';

const noUpdate = 'Chưa cập nhật';

export default function Store(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const onChangePassword = (text) => setPassword(text);
  const onChangeNewPassword = (text) => setNewPassword(text);

  const { data, refetch } = useQuery(QUERY.GET_USER_INFO, {
    variables: {
      role: "shipper"
    },
    fetchPolicy: 'only-network',
  });

  const [changePassword] = useMutation(MUTATION.CHANGE_PASSWORD, {
    variables: {
      oldPassword: password,
      newPassword: newPassword
    },
    onCompleted: (data) => {
      setModalVisible(false);
      Toast('Đổi mật khẩu thành công', 'success', 'top-right');
    },
    onError: (error) => {
      Toast(error.message, 'danger', 'top-right');
    }
  })

  React.useEffect(() => {
    navigation.addListener('focus', () => {
      refetch();
    });
  }, []);
    

  const changePasswordHandler = async () => {
    // validate password
    if (password === '' || newPassword === '') {
      Toast('Vui lòng nhập đầy đủ thông tin', 'danger', 'top-right');
      return;
    }

    // new password > 6 characters
    if (newPassword.length < 6) {
      Toast('Mật khẩu mới phải có ít nhất 6 ký tự', 'danger', 'top-right');
      return;
    }

    // check 2 password dont  same password
    if (password === newPassword) {
      Toast('Mật khẩu mới không được trùng với mật khẩu cũ', 'danger', 'top-right');
      return;
    }

    await changePassword();
  }


  const logOut = async () => {
    await storageUtils.removeItem("token");
    await storageUtils.removeItem("phoneNumber");
    await storageUtils.removeItem("password");
    navigation.navigate(SCREEN.LOGIN, { clear: true });
  }

  const navigation = useNavigation();
  return (
    <View style={styles.mainContainer}>
      <Header title={"NFood Shipper"} />
      <ScrollView style={{ marginBottom: hp('6%') }}>
        <View style={styles.infoContainer}>
          {data ? (<Image source={{ uri: data?.getUser?.image }} style={styles.image} />) : null}
          <View>
            <Text fontSize="xl">{data?.getUser?.name}</Text>
            <View style={styles.phoneContainer}>
              <Text fontSize="md">{data?.getUser?.phoneNumber}</Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text color="#0369a1">Đổi mật khẩu</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.logOut} onPress={logOut}>
              <Text color="#0369a1">
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.shipping}>
          <Text fontSize="md" mr="4">Giá ship hiện tại:</Text>
          <Text fontSize="md" color="#be123c" bold>{moneyUtils.convertVNDToString(5000)} đ/km</Text>
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate(SCREEN.REVIEW)}>
          <Text fontSize="md" mr="4">Xem đánh giá</Text>
          <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonContainerDown}>
          <Text fontSize="md" mr="4">Khai báo vaccine</Text>
          <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
        </TouchableOpacity>

        <View style={styles.info}>
          <Text bold fontSize="md">Ngày sinh:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.birthday || noUpdate}</Text>

          <Text bold fontSize="md">Số CMND/ CCCD:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.number || noUpdate}</Text>

          <Text bold fontSize="md">Nơi cấp:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.place || noUpdate}</Text>

          <Text bold fontSize="md">Ngày cấp:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.identityCard?.date || noUpdate}</Text>

          <Text bold fontSize="md">Ảnh chụp CMND/CCCD:</Text>
          <Text fontSize="md" color="#a8a29e" mb="2">{noUpdate}</Text>

          <TouchableOpacity style={styles.updateButton}>
            <Text color="#0369a1" fontSize="xl" mr="4">Chỉnh sửa thông tin</Text>
            <FontAwesome5 name="angle-right" size={20} color="#0369a1" />
          </TouchableOpacity>
        </View>

        <View style={styles.creditCard}>
          <Text fontSize="md" mr="4" bold>Thẻ tín dụng:</Text>
          <View style={styles.card}>
            <Text fontSize="md" color="#a8a29e" mb="2">{data?.getUser?.bank?.accountNumber || noUpdate}</Text>
            {
              !data?.getUser?.creditCard?.number ? (<TouchableOpacity onPress={() => navigation.navigate(SCREEN.ADD_BANK, {
                bank: data?.getUser?.bank,
              })}>
                <Text color="#0369a1" fontSize="md">{ data?.getUser?.bank ? 'Cập nhật ngân hàng'  : 'Thêm thẻ ngân hầng'}</Text>
              </TouchableOpacity>) : null
            }
          </View>
        </View>

        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          closeOnOverlayClick={false}
        >
          <Modal.Content>
            <Modal.CloseButton />
            <Modal.Header>Đổi mật khẩu mới</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Mật khẩu hiện tại</FormControl.Label>
                <Input onChangeText={onChangePassword} type='password' />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Mật khẩu mới</FormControl.Label>
                <Input onChangeText={onChangeNewPassword} type='password' />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setModalVisible(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    changePasswordHandler();
                  }}
                >
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  infoContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
    width: wp('60%'),
  },
  logOut: {
    marginTop: 20,
  },
  shipping: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 3,
    paddingVertical: hp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  buttonContainerDown: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    backgroundColor: '#fff',
    marginTop: 3,
    paddingVertical: hp('2%'),
    justifyContent: 'space-between',
  },
  info: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginTop: 10,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  creditCard: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  }
});