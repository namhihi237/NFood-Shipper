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
  }`,

  UPDATE_LOCATION: gql`mutation UpdateLocationShipper($latitude: Float!, $longitude: Float!) {
    updateLocationShipper(latitude: $latitude, longitude: $longitude)
  }`,

  ACTIVE_SHIPPER_ORDER: gql`mutation Mutation {
    activeShippingOrder
  }`,

  ACCEPT_RECEIVE_SHIPPER_ORDER: gql`mutation AcceptShippingOrder($orderId: ID!) {
    acceptShippingOrder(orderId: $orderId) {
    _id
    address
      invoiceNumber
      subTotal
      shipping
      discount
      total
      orderItems {
        _id
        price
        quantity
        name
        image
        note
      }
      phoneNumber
      name
      estimatedDeliveryTime
      paymentStatus
      orderStatus
      createdAt
      vendor {
        name
        location {
          coordinates
        }
        address
      }
    }
  }`,
  PICK_UP_SHIPPER_ORDER: gql`mutation PickUpOrder($orderId: ID!) {
    pickUpOrder(orderId: $orderId)
  }`,

  COMPLETE_SHIPPER_ORDER: gql`mutation CompleteShippingOrder($orderId: ID!) {
    completeShippingOrder(orderId: $orderId)
  }`,

  RESET_NUMBER_OF_NOTIFICATIONS: gql`mutation ResetNumberOfNotifications($userType: roleEnum!) {
    resetNumberOfNotifications(userType: $userType)
  }`,

  UPDATE_MAX_DISTANCE: gql`mutation UpdateMaxDistanceReceiveOrder($maxDistance: Float!) {
    updateMaxDistanceReceiveOrder(maxDistance: $maxDistance)
  }`,

  FORGOT_PASSWORD: gql`mutation ForgotPassword($phoneNumber: String!) {
    forgotPassword(phoneNumber: $phoneNumber)
  }`,

  VERIFY_CODE: gql`mutation VerifyCode($code: String!, $phoneNumber: String!) {
    verifyCode(code: $code, phoneNumber: $phoneNumber)
  }`,

  UPDATE_PASSWORD: gql`mutation UpdatePassword($password: String!, $code: String!) {
    updatePassword(password: $password, code: $code)
  }`,

  CHANGE_PASSWORD: gql`mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
    changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
  }`
}