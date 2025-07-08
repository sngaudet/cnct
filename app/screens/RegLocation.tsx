import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const OPENCAGE_API_KEY = "0c3fe9f7e0604478bda0d6c7e9752428"; // replace with your actual key or load from env

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

  const handleNext = () => {
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
      ) : location ? (
        <>
          {/* <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text> */}
          {location.address && (
            <>
              <Text style={styles.headerText}>
                We show you as being located in
              </Text>
              <Text style={styles.text}>
                {location.address.city}, {location.address.state}
              </Text>
            </>
          )}
          <Button title="Next" onPress={handleNext} />
        </>
      ) : (
        <Text>Getting location...</Text>
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
});
