import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

type Props = NativeStackScreenProps<RootStackParamList, "RegPersonalDetails">;

const RegPersonalDetails = ({ navigation, route }: Props) => {
  const { email, password, height, weight, location } = route.params;

  const [religion, setReligion] = useState("");
  const [smoker, setSmoker] = useState("");
  const [drinker, setDrinker] = useState("");

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
        <TextInput
          value={religion}
          style={styles.input}
          placeholder="Religion"
          onChangeText={setReligion}
        />
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
