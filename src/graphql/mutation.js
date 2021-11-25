import { gql } from '@apollo/client';
export default {
  REGISTER: gql`mutation register($phoneNumber: String!,$password: String!, $role: roleEnum!) {
    register(phoneNumber: $phoneNumber,  password: $password, role: $role) {
      _id
      role
      phoneNumber  
    }
  }`,

  LOGIN: gql`mutation login($phoneNumber: String!, $password: String!) {
    login(phoneNumber: $phoneNumber, password: $password) {
      user {
        _id
        role
        isShipper
      }
      token
    }
  }`,

  RESEND_CODE: gql`mutation GetCodePhoneNumber($phoneNumber: String!) {
    getCodePhoneNumber(phoneNumber: $phoneNumber)
  }`,

  ACTIVE_PHONE_NUMBER: gql`mutation ActivePhoneNumber($phoneNumber: String!, $code: String!) {
    activePhoneNumber(phoneNumber: $phoneNumber, code: $code) {
      token
      user {
      name  
      }
    }
  }`,

  ACTIVE_SHIPPER: gql`mutation ActiveShipper($name: String!, $image: String!) {
    activeShipper(name: $name, image: $image) {
      success
      message
    }
  }`
}