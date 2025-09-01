// app/screens/RegPhotos.tsx
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";
import { FIREBASE_STORAGE } from "../../FirebaseConfig";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "RegPhotos">;

const RegPhotos = ({ navigation, route }: Props) => {
  const { email, password, location, gender, seeking } = route.params;
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImages((prev) => [...prev, uri]);
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    setUploading(true);
    const urls: string[] = [];

    for (const uri of images) {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = `profile_${uuid.v4()}`;
      const imageRef = ref(FIREBASE_STORAGE, `profilePictures/${fileName}`);

      await uploadBytes(imageRef, blob);
      const url = await getDownloadURL(imageRef);
      urls.push(url);
    }

    setUploading(false);
    return urls;
  };

  const handleNext = async () => {
    if (images.length === 0) {
      alert("Please select at least one photo.");
      return;
    }

    const uploadedUrls = await uploadImages();

    navigation.navigate("RegHeightWeight", {
      email,
      password,
      location,
      gender,
      seeking,
      photos: uploadedUrls,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Upload Your Photos</Text>

      <Button title="Pick a Photo" onPress={pickImage} />

      <View style={styles.previewContainer}>
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleNext}
        disabled={uploading}
      >
        <Text style={styles.nextButtonText}>
          {uploading ? "Uploading..." : "Upload"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.skipButton}
  onPress={() =>
    navigation.navigate("RegHeightWeight", {
      email,
      password,
      location,
      gender,
      seeking,
      photos: [],
    })
  }
>
  <Text style={styles.skipButtonText}>Skip for now</Text>
</TouchableOpacity>
    </ScrollView>
  );
};

export default RegPhotos;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  previewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  nextButton: {
    backgroundColor: "#3399ff",
    padding: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  nextButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  skipButton: {
  marginTop: 10,
  padding: 10,
  borderRadius: 6,
  borderColor: "#999",
  borderWidth: 1,
  backgroundColor: "#eee",
},
skipButtonText: {
  color: "#333",
  fontWeight: "bold",
},

});
