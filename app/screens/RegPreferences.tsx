// app/screens/RegPreferences.tsx
import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RegPreferences">;

const religionOptions = [
  "Christian",
  "Jewish",
  "Muslim",
  "Hindu",
  "Buddhist",
  "Sikh",
  "Atheist",
  "Agnostic",
  "Other",
];

const YesNoSelector = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}) => {
  return (
    <View style={styles.preferenceBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, value === true && styles.selected]}
          onPress={() => onChange(true)}
        >
          <Text style={styles.buttonText}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, value === false && styles.selected]}
          onPress={() => onChange(false)}
        >
          <Text style={styles.buttonText}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
    gender,
    seeking,
    photos,
  } = route.params;

  const [maxDistance, setMaxDistance] = useState("25");
  const [partnerReligionImportant, setPartnerReligionImportant] = useState<boolean | null>(null);
  const [preferredPartnerReligion, setPreferredPartnerReligion] = useState("");
  const [partnerSmokesOk, setPartnerSmokesOk] = useState<boolean | null>(null);
  const [partnerDrinksOk, setPartnerDrinksOk] = useState<boolean | null>(null);

  const handleNext = () => {
    if (
      partnerReligionImportant === null ||
      partnerSmokesOk === null ||
      partnerDrinksOk === null
    ) {
      alert("Please answer all Yes/No questions.");
      return;
    }

    if (partnerReligionImportant && preferredPartnerReligion.trim() === "") {
  alert("Please specify the religion you prefer your partner to be.");
  return;
}


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
        preferredReligion: partnerReligionImportant ? preferredPartnerReligion : null,
        allowsSmoking: partnerSmokesOk,
        allowsDrinking: partnerDrinksOk,
      },
      gender,
      seeking,
      photos,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Preferences</Text>

      <Text style={styles.label}>What is the maximum distance you would travel to date?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={maxDistance}
        onChangeText={setMaxDistance}
      />

      <YesNoSelector
        label="Is your partner's religion important to you?"
        value={partnerReligionImportant}
        onChange={setPartnerReligionImportant}
      />

     {partnerReligionImportant && (
  <View style={styles.religionInputBlock}>
    <Text style={styles.label}>What religion would you prefer your partner to be?</Text>
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={preferredPartnerReligion}
        onValueChange={(itemValue) => setPreferredPartnerReligion(itemValue)}
      >
        <Picker.Item label="Select a religion..." value="" />
        {religionOptions.map((religion) => (
          <Picker.Item key={religion} label={religion} value={religion} />
        ))}
      </Picker>
    </View>
  </View>
)}

      <YesNoSelector
        label="Is it okay if your partner smokes cigarettes?"
        value={partnerSmokesOk}
        onChange={setPartnerSmokesOk}
      />

      <YesNoSelector
        label="Is it okay if your partner drinks?"
        value={partnerDrinksOk}
        onChange={setPartnerDrinksOk}
      />

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
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  preferenceBlock: {
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  selected: {
    backgroundColor: "#4f46e5",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  religionInputBlock: {
  marginBottom: 20,
},
pickerWrapper: {
  borderWidth: 1,
  borderColor: "#aaa",
  borderRadius: 6,
  overflow: "hidden",
},

});
