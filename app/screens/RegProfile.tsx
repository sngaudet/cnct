// app/screens/RegProfile.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type Props = NativeStackScreenProps<RootStackParamList, "RegProfile">;

const RegProfile = ({ route, navigation }: Props) => {
  const { email, password, height, weight, religion, smoker, drinker } =
    route.params;
  console.log("Incoming:", {
    email,
    password,
    height,
    weight,
    religion,
    smoker,
    drinker,
  });
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );

      const uid = userCredential.user.uid;

      await setDoc(doc(FIRESTORE_DB, "users", uid), {
        email,
        height,
        weight,
        religion,
        smoker,
        drinker,
        bio,
        createdAt: new Date(),
      });

      console.log("User created:", userCredential.user.uid);
      console.log("Bio:", bio);

      // You can now navigate to the inside/home screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Inside" }],
      });
    } catch (error: any) {
      console.log(error);
      alert("Account creation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <Text>And finally... Introduce yourself!!!</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="your intro..."
        multiline
        value={bio}
        onChangeText={setBio}
      />
      <Button
        title="Finish Registration"
        onPress={handleSubmit}
        disabled={loading}
      />
    </KeyboardAvoidingView>
  );
};

export default RegProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    justifyContent: "center",
  },
  input: {
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});
