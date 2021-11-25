import { Text, View } from "native-base";
import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useLazyQuery } from '@apollo/client';

import { InputField, ButtonCustom, Toast, Loading } from '../../components';
import { SCREEN } from "../../constants";
import { MUTATION, QUERY } from '../../graphql';
import _ from 'lodash';
import * as ImagePicker from 'react-native-image-picker';
const noImage = "https://res.cloudinary.com/do-an-cnpm/image/upload/v1635665899/no-image_lma0vq.jpg";
import axios from 'axios';
import { createFormData } from '../../utils';

export default function ActiveShipper(props) {
  const navigation = useNavigation();
  let [name, setName] = React.useState("");
  let [photo, setPhoto] = React.useState('');
  const [loadingImage, setLoadingImage] = React.useState(false);

  const onChangeName = value => setName(value);

  const handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets) {
        setPhoto(response.assets[0]);
      }
    });
  };

  const [activeShipperMutate, { loading: loadingActiveShipper }] = useMutation(MUTATION.ACTIVE_SHIPPER, {
    onCompleted: (data) => {
      Toast("Bạn đã đăng ký giao hàng thành công", 'success', 'top-right');
      navigation.navigate(SCREEN.TAB);
    },
  });

  const [uploadImage, { loading: loadingUploadImage }] = useLazyQuery(QUERY.GET_SIGNATURE, {
    fetchPolicy: 'no-cache',
    onCompleted: async (data) => {
      const link = data.getSignatureImage;
      try {
        setLoadingImage(true);
        const upload = await axios.post(link, createFormData(photo), {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoadingImage(false);
        let image1 = upload.data.secure_url || null;
        if (!image1) {
          Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
          return;
        }
        activeShipperMutate({ variables: { name, image: image1 } });
      } catch (error) {
        Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
      }
    },
    onError: (error) => {
      Toast('Đã có lỗi thử lại!', 'danger', 'top-right');
    }
  });

  const activeShipper = () => {
    if (!name || !photo) {
      Toast("Vui lòng nhập đầy đủ thông tin", "danger", "top-right");
      return;
    }
    uploadImage();
  }

  return (
    <ScrollView style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.mainContainer}>
        <Loading loading={loadingImage || loadingUploadImage || loadingActiveShipper} />
        <View>
          <View style={{ alignItems: 'center', marginTop: hp("5%"), marginBottom: 30 }}>
            <Text fontSize="2xl" bold>Đăng ký người giao hàng</Text>
          </View>
          <Text bold>Nhập tên đầy đủ của bạn (*)</Text>
          <InputField width="90%" onChangeText={onChangeName} />

          <Text bold>Ảnh chân dung của bạn (*)</Text>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Image source={{ uri: photo ? photo.uri : noImage }} style={{ height: 200, width: 200, marginTop: 25, }} />
            </TouchableOpacity>
          </View>

        </View>
        <View style={{ alignItems: 'center' }}>
          <ButtonCustom title={"Giao hàng ngay"} width="90%" height={"7%"} onPress={activeShipper} />
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1,
    height: hp("96%"),
    paddingLeft: wp("5%"),
    paddingRight: wp("5%"),
    display: 'flex',
    justifyContent: 'space-between',
    paddingBottom: hp("5%")
  },

});