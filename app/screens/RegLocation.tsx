import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import * as Location from "expo-location";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "RegLocation">;

type SimpleCoords = {
  latitude: number;
  longitude: number;
};

const RegLocation = ({ navigation, route }: Props) => {
  const [location, setLocation] = useState<SimpleCoords | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);

      if (Platform.OS === "web") {
        // Web fallback using browser geolocation
        if (!navigator.geolocation) {
          alert("Geolocation is not supported by your browser.");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setLoading(false);
          },
          (error) => {
            alert("Failed to get location: " + error.message);
            setLoading(false);
          }
        );
      } else {
        // iOS/Android using expo-location
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access location was denied.");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const handleNext = () => {
    if (!location) {
      alert("Location not yet retrieved.");
      return;
    }

    navigation.navigate("RegHeightWeight", {
      ...route.params,
      location,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : location ? (
        <>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
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
});
