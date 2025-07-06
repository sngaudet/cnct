import { View, Text, Button } from "react-native";
import React from "react";
import { NavigationProp } from "@react-navigation/native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { InsideStackParamList } from "../navigation/types";

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Go to Chats"
        onPress={() => navigation.navigate("ChatList")}
      />

      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

export default List;
