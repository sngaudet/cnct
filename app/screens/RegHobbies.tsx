// app/screens/RegHobbies.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Button,
} from "react-native";
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

const hobbiesList = [
  "Reading",
  "Writing",
  "Running",
  "Cooking",
  "Video Games",
  "Board Games",
  "Traveling",
  "Music",
  "Playing Instruments",
  "Photography",
  "Videography",
  "Television",
  "Movies",
  "Dancing",
  "Art",
  "Hiking",
  "Pets",
];

type Props = NativeStackScreenProps<RootStackParamList, "RegHobbies">;

const RegHobbies = ({ route, navigation }: Props) => {
  const {
    email,
    password,
    height,
    weight,
    location,
    religion,
    smoker,
    drinker,
  } = route.params;

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobby) ? prev.filter((h) => h !== hobby) : [...prev, hobby]
    );
  };

  const handleNext = () => {
    navigation.navigate("RegProfile", {
      email,
      password,
      height,
      weight,
      location,
      religion,
      smoker,
      drinker,
      hobbies: selectedHobbies,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Your Hobbies</Text>
      <FlatList
        data={hobbiesList}
        keyExtractor={(item) => item}
        numColumns={2}
        renderItem={({ item }) => {
          const selected = selectedHobbies.includes(item);
          return (
            <TouchableOpacity
              style={[styles.hobbyItem, selected && styles.selected]}
              onPress={() => toggleHobby(item)}
            >
              <Text style={styles.hobbyText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <Button
        title="Next"
        onPress={handleNext}
        disabled={selectedHobbies.length === 0}
      />
    </View>
  );
};

export default RegHobbies;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
  },
  hobbyItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },
  hobbyText: {
    fontSize: 16,
  },
});
