// app/screens/RegHobbies.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
    Button,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View
} from "react-native";
import { RootStackParamList } from "../navigation/types";


type Props = NativeStackScreenProps<RootStackParamList, "RegPreferences">;

const RegPreferences = ({ route, navigation }: Props) => {
  const {
    email,
    password,
    height,
    weight,
    location,
    religion,
    smoker,
    drinker,
    hobbies,
  } = route.params;

   const [maxDistance, setMaxDistance] = useState("25"); // miles or km
  const [partnerReligionImportant, setPartnerReligionImportant] = useState(false);
  const [partnerSmokesOk, setPartnerSmokesOk] = useState(true);
  const [partnerDrinksOk, setPartnerDrinksOk] = useState(true);

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
      hobbies,
      preferences: {
        maxDistance: parseInt(maxDistance),
        religionImportant: partnerReligionImportant,
        allowsSmoking: partnerSmokesOk,
        allowsDrinking: partnerDrinksOk,
      }
    });
  };

   return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Preferences</Text>

      <Text style={styles.label}>Max Distance (km or miles):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={maxDistance}
        onChangeText={setMaxDistance}
      />

      <View style={styles.preferenceRow}>
        <Text>Is partner's religion important?</Text>
        <Switch
          value={partnerReligionImportant}
          onValueChange={setPartnerReligionImportant}
        />
      </View>

      <View style={styles.preferenceRow}>
        <Text>Okay if partner smokes?</Text>
        <Switch value={partnerSmokesOk} onValueChange={setPartnerSmokesOk} />
      </View>

      <View style={styles.preferenceRow}>
        <Text>Okay if partner drinks?</Text>
        <Switch value={partnerDrinksOk} onValueChange={setPartnerDrinksOk} />
      </View>

      <Button title="Next" onPress={handleNext} />
    </View>
  );
};

export default RegPreferences;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  preferenceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
