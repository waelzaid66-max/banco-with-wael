import { Platform } from "react-native";

/** Default radius when the user enables "Near me" (km). */
export const DEFAULT_NEAR_RADIUS_KM = 25;

/**
 * Selectable radii for the "Near me" search (km). The row is rendered ONLY while
 * near-me is enabled, so the compact filter sheet keeps its default height.
 * 5 → walking/neighbourhood, 100 → whole-governorate reach.
 */
export const NEAR_RADIUS_OPTIONS_KM = [5, 10, 25, 50, 100] as const;

/**
 * Requests foreground location permission and returns the device coordinates.
 * Returns null on denied permission, missing geolocation, or any runtime error.
 * Web uses the browser Geolocation API (MAP-05); native uses expo-location.
 */
export async function requestNearMeCoords(): Promise<{
  lat: number;
  lng: number;
} | null> {
  if (Platform.OS === "web") {
    if (typeof navigator === "undefined" || !navigator.geolocation) return null;
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { enableHighAccuracy: false, maximumAge: 60_000, timeout: 12_000 },
      );
    });
  }
  try {
    const Location = await import("expo-location");
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      const req = await Location.requestForegroundPermissionsAsync();
      status = req.status;
    }
    if (status !== "granted") return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return null;
  }
}
