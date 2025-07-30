import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RegPersonalDetails">;

const RegPersonalDetails = ({ navigation, route }: Props) => {
  const { email, password, height, weight, location } = route.params;

  const [religion, setReligion] = useState("");
  const [smoker, setSmoker] = useState("");
  const [drinker, setDrinker] = useState("");

  const religionOptions = ["Select...","Christian", "Jewish", "Muslim", "Hindu", "Buddhist", "Sikh", "Atheist", "Agnostic", "Other"];
  const smokerOptions = ["Select...", "Yes", "Occasionally", "Never"];
  const drinkerOptions = ["Select...", "Yes", "Occasionally", "Never"];

  const nextStep = () => {
    if (religion === "") {
      alert("Please select a religion.");
      return;
    }
    if (
      smoker === "Select..." ||
      drinker === "Select..." ||
      smoker === "" ||
      drinker === ""
    ) {
      alert("Please select both smoking and drinking preferences.");
      return;
    }
    navigation.navigate("RegHobbies", {
      email,
      password,
      height,
      weight,
      religion,
      smoker,
      drinker,
      location,
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.label}>Religion</Text>
        <Picker
          selectedValue={religion}
          onValueChange={(itemValue) => setReligion(itemValue)}
          style={styles.picker}
        >
          {religionOptions.map((opt) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
        <Text style={styles.label}>Smoker</Text>
        <Picker
          selectedValue={smoker}
          onValueChange={(itemValue) => setSmoker(itemValue)}
          style={styles.picker}
        >
          {smokerOptions.map((opt) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
        <Text style={styles.label}>Drinker</Text>
        <Picker
          selectedValue={drinker}
          onValueChange={(itemValue) => setDrinker(itemValue)}
          style={styles.picker}
        >
          {drinkerOptions.map((opt) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
        <Button title="Next" onPress={nextStep} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegPersonalDetails;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 150,
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 16,
  },
});
