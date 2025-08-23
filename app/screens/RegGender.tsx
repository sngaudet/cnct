// app/screens/RegGender.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
    Button,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RegGender">;

const genders = ["Man", "Woman", "Non-binary", "Other"];
const seekingOptions = ["Men", "Women", "Non-binary", "Everyone"];

const RegGender = ({ navigation, route }: Props) => {
  const { email, password, location } = route.params;
  const [gender, setGender] = useState<string | null>(null);
  const [seeking, setSeeking] = useState<string[]>([]);

  const toggleSeeking = (option: string) => {
    setSeeking((prev) =>
      prev.includes(option)
        ? prev.filter((s) => s !== option)
        : [...prev, option]
    );
  };

  const handleNext = () => {
    if (!gender || seeking.length === 0) {
      alert("Please select your gender and who you're seeking.");
      return;
    }

    navigation.navigate("RegHeightWeight", {
      email,
      password,
      location,
      gender,
      seeking,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Gender:</Text>
      {genders.map((g) => (
        <TouchableOpacity
          key={g}
          style={[styles.option, gender === g && styles.selected]}
          onPress={() => setGender(g)}
        >
          <Text>{g}</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.label, { marginTop: 20 }]}>Seeking:</Text>
      {seekingOptions.map((s) => (
        <TouchableOpacity
          key={s}
          style={[styles.option, seeking.includes(s) && styles.selected]}
          onPress={() => toggleSeeking(s)}
        >
          <Text>{s}</Text>
        </TouchableOpacity>
      ))}

      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

export default RegGender;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginVertical: 5,
  },
  selected: {
    backgroundColor: "#cce5ff",
    borderColor: "#3399ff",
  },
});
