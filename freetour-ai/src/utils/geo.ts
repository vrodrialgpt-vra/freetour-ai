export function toRadians(value: number) {
  return (value * Math.PI) / 180
}

export function distanceMeters(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
) {
  const earth = 6371e3
  const dLat = toRadians(bLat - aLat)
  const dLng = toRadians(bLng - aLng)
  const lat1 = toRadians(aLat)
  const lat2 = toRadians(bLat)

  const haversine =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  return earth * c
}
