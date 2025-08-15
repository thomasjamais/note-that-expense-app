import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'hasSeenOnboarding';

export async function getHasSeenOnboarding() {
  try {
    return (await AsyncStorage.getItem(KEY)) === '1';
  } catch {
    return false;
  }
}
export async function setHasSeenOnboarding() {
  try {
    await AsyncStorage.setItem(KEY, '1');
  } catch {}
}
