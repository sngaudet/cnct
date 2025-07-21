import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { RootStackParamList } from "../navigation/types";

const OPENCAGE_API_KEY = "0c3fe9f7e0604478bda0d6c7e9752428"; // Replace with env var in production

type SimpleCoords = {
  latitude: number;
  longitude: number;
};

type FullLocation = {
  coords: SimpleCoords;
  address?: {
    city?: string;
    state?: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, "RegLocation">;

const RegLocation = ({ navigation, route }: Props) => {
  const [location, setLocation] = useState<FullLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualCity, setManualCity] = useState("");
  const [manualState, setManualState] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = loc.coords;

        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
        );
        const data = await response.json();

        const components = data.results[0]?.components;
        const city =
          components?.city || components?.town || components?.village || "";
        const state = components?.state || "";

        setLocation({
          coords: { latitude, longitude },
          address: { city, state },
        });
      } catch (error) {
        console.error("Location error:", error);
        alert("Failed to get location.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

const handleNext = async () => {
  if (manualMode) {
    if (!manualCity || !manualState) {
      alert("Please enter both city and state.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          manualCity + ", " + manualState
        )}&key=${OPENCAGE_API_KEY}`
      );
      const data = await response.json();

      const geometry = data.results[0]?.geometry;
      if (!geometry) {
        alert("Could not resolve coordinates from manual input.");
        return;
      }

      navigation.navigate("RegHeightWeight", {
        ...route.params,
        location: {
          latitude: geometry.lat,
          longitude: geometry.lng,
          city: manualCity,
          state: manualState,
        },
      });
    } catch (error) {
      console.error("Forward geocoding failed:", error);
      alert("Failed to get coordinates from manual input.");
    }

    return;
  }

  if (!location) {
    alert("Location not yet retrieved.");
    return;
  }

  navigation.navigate("RegHeightWeight", {
    ...route.params,
    location: {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      city: location.address?.city,
      state: location.address?.state,
    },
  });
};


  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {!manualMode && location?.address && (
            <>
              <Text style={styles.headerText}>We show you as being located in</Text>
              <Text style={styles.text}>
                {location.address.city}, {location.address.state}
              </Text>
            </>
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.text}>Set location manually?</Text>
            <Switch value={manualMode} onValueChange={setManualMode} />
          </View>

          {manualMode && (
            <>
              <TextInput
                placeholder="Enter City"
                style={styles.input}
                value={manualCity}
                onChangeText={setManualCity}
              />
              <TextInput
                placeholder="Enter State"
                style={styles.input}
                value={manualState}
                onChangeText={setManualState}
              />
            </>
          )}

          <Button title="Next" onPress={handleNext} />
        </>
      )}
    </View>
  );
};

export default RegLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  headerText: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: "80%",
  },
});
