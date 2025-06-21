import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "RegPersonalDetails">;

const RegPersonalDetails = ({ navigation, route }: Props) => {
  const { email, password, height, weight } = route.params;

  const [religion, setReligion] = useState("");
  const [smoker, setSmoker] = useState("");
  const [drinker, setDrinker] = useState("");

  const nextStep = () => {
    navigation.navigate("RegProfile", {
      email,
      password,
      height,
      weight,
      religion,
      smoker,
      drinker,
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
        <TextInput
          value={smoker}
          style={styles.input}
          placeholder="Do you smoke?"
          onChangeText={setSmoker}
        />
        <TextInput
          value={drinker}
          style={styles.input}
          placeholder="Do you drink?"
          onChangeText={setDrinker}
        />
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
});
