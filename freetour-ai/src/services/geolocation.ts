import * as Location from 'expo-location'

export async function requestLocationPermission() {
  const result = await Location.requestForegroundPermissionsAsync()
  return result.status === 'granted'
}

export async function getCurrentPosition() {
  return Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
}

export async function reverseCityName(latitude: number, longitude: number) {
  const results = await Location.reverseGeocodeAsync({ latitude, longitude })
  return results[0]?.city ?? 'Barcelona'
}
