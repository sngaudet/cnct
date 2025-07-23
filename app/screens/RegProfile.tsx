// app/screens/RegProfile.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Button,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RegProfile">;

const RegProfile = ({ route, navigation }: Props) => {
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
    preferences,
  } = route.params;
  console.log("Incoming:", {
    email,
    password,
    height,
    weight,
    location,
    religion,
    smoker,
    drinker,
    hobbies,
  });
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (bio.trim() === "") {
        alert("Your bio is empty!");
        setLoading(false);
        return;
      }

      // Try to create user here
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
        location,
        religion,
        smoker,
        drinker,
        hobbies,
        preferences,
        bio,
        isMatched: false,
        profileComplete: true,
        createdAt: new Date(),
      });

      // Navigate to Inside/Home screen
      navigation.reset({
        index: 0,
        routes: [{ name: "Inside" }],
      });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please use another one.");
      } else {
        alert("Account creation failed: " + error.message);
      }
      console.error("Registration error:", error);
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
