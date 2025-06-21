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

type Props = NativeStackScreenProps<RootStackParamList, "RegHeightWeight">;

const RegHeightWeight = ({ navigation, route }: Props) => {
  const { email, password } = route.params;

  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const nextStep = () => {
    navigation.navigate("RegPersonalDetails", {
      email,
      password,
      height,
      weight,
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={height}
          style={styles.input}
          placeholder="Height"
          onChangeText={setHeight}
        />
        <TextInput
          value={weight}
          style={styles.input}
          placeholder="Weight (e.g., 160 lbs)"
          onChangeText={setWeight}
        />
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
});
