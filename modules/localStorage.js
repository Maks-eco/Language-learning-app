import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log(e)
  }
}

const getData = async (key) => {
  try {
    // const value = getDataPlug(key)
    const value = await AsyncStorage.getItem(key /*'@storage_Key'*/)
    if(value !== null) {
      // console.log('value imported!')
      return value
    }
  } catch(e) {
    console.log(e)    
  }
}

export { storeData, getData }