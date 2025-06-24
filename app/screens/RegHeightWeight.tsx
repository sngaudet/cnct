import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Picker } from "@react-native-picker/picker";

type Props = NativeStackScreenProps<RootStackParamList, "RegHeightWeight">;

const RegHeightWeight = ({ navigation, route }: Props) => {
  const { email, password, location } = route.params;

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const heightOptions = ["Select..."];
  for (let feet = 2; feet <= 9; feet++) {
    for (let inches = 0; inches <= 12; inches++) {
      heightOptions.push(`${feet}'${inches}"`);
    }
  }

  const weightOptions = ["Select..."];
  for (let pounds = 90; pounds <= 500; pounds++) {
    weightOptions.push(`${pounds} pounds`);
  }

  const nextStep = () => {
    if (
      height === "Select..." ||
      weight === "Select..." ||
      height === "" ||
      weight === ""
    ) {
      alert("Please enter all fields");
      return;
    }
    navigation.navigate("RegPersonalDetails", {
      email,
      password,
      height,
      weight,
      location,
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.label}>Height</Text>
        <Picker
          selectedValue={height}
          onValueChange={(itemValue) => setHeight(itemValue)}
          style={styles.picker}
        >
          {heightOptions.map((opt) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
        <Text style={styles.label}>Weight</Text>
        <Picker
          selectedValue={weight}
          onValueChange={(itemValue) => setWeight(itemValue)}
          style={styles.picker}
        >
          {weightOptions.map((opt) => (
            <Picker.Item label={opt} value={opt} key={opt} />
          ))}
        </Picker>
        <Button title="Next" onPress={nextStep} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegHeightWeight;

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
