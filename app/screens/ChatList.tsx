import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { InsideStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  InsideStackParamList,
  "ChatScreen"
>;

type User = {
  id: string;
  email: string;
  sharedHobbies: number;
};

const ChatList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchUsersWithCommonHobbies = async () => {
      if (!currentUser) return;

      const usersRef = collection(FIRESTORE_DB, "users");

      // Get current user's hobbies
      const currentUserSnapshot = await getDocs(
        query(usersRef, where("email", "==", currentUser.email))
      );

      if (currentUserSnapshot.empty) return;

      const currentUserData = currentUserSnapshot.docs[0].data();
      const currentUserHobbies: string[] = currentUserData.hobbies || [];

      // Get other users
      const snapshot = await getDocs(
        query(usersRef, where("email", "!=", currentUser.email))
      );

      const matchedUsers: User[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const otherUserHobbies: string[] = data.hobbies || [];

        // Find shared hobbies
        const shared = currentUserHobbies.filter((hobby) =>
          otherUserHobbies.includes(hobby)
        );

        if (shared.length > 0) {
          matchedUsers.push({
            id: doc.id,
            email: data.email,
            sharedHobbies: shared.length,
          });
        }
      });

      // Sort by number of shared hobbies (descending)
      matchedUsers.sort((a, b) => b.sharedHobbies - a.sharedHobbies);

      setUsers(matchedUsers);
    };

    fetchUsersWithCommonHobbies();
  }, []);

  const handleUserPress = (otherUser: User) => {
    navigation.navigate("ChatScreen", {
      chatId: null,
      userId: otherUser.id,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Start a chat (sorted by shared hobbies):
      </Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUserPress(item)}
            style={{ padding: 10, borderBottomWidth: 1 }}
          >
            <Text>{item.email}</Text>
            <Text style={{ color: "gray" }}>
              Shared hobbies: {item.sharedHobbies}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatList;
