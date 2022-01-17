import AsyncStorage from '@react-native-async-storage/async-storage';

class Storage {

  async getString(key) {
    try {
      const value = await AsyncStorage.getItem(key)
      if (value !== null) {
        return value;
      }
    } catch (e) {
      return null;
    }
  }

  async setString(key, value) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (e) {
      return null;
    }
  }

  async getObject(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      return null;
    }
  }

  async setObject(key, value) {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
    } catch (e) {
      return null;
    }
  }

  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (e) {
      return null;
    }
  }
}

export default new Storage();