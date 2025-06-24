import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type RegEmailPassNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "RegEmailPass"
>;

const RegEmailPass = () => {
  const navigation = useNavigation<RegEmailPassNavProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (email === "" || password === "" || confirmPassword === "") {
      alert("Please enter all fields");
      return;
    }

    setLoading(true);
    try {
      // Attempt to create the user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Immediately delete the temporary user (so final registration can recreate later)
      await userCred.user.delete();

      // Navigate forward with safe email/password
      navigation.navigate("RegLocation", { email, password });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use another one.");
      } else {
        alert("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={confirmPassword}
          style={styles.input}
          placeholder="Confirm Password"
          autoCapitalize="none"
          onChangeText={(text) => setConfirmPassword(text)}
        ></TextInput>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Create Account" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegEmailPass;

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
