import React, { useEffect, useState } from "react";
import { View, FlatList, Text, TouchableOpacity } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { InsideStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  InsideStackParamList,
  "ChatScreen"
>;

type User = {
  id: string;
  email: string;
};

const ChatList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const navigation = useNavigation<NavigationProp>();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser) return;

      const usersRef = collection(FIRESTORE_DB, "users");
      const q = query(usersRef, where("email", "!=", currentUser.email));
      const snapshot = await getDocs(q);

      const data: User[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
      }));

      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleUserPress = (otherUser: User) => {
    // Navigate to ChatScreen with other user's ID
    navigation.navigate("ChatScreen", {
      chatId: null, // Or null if no chat exists yet
      userId: otherUser.id, // ID of the user you're chatting with
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Start a chat:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleUserPress(item)}
            style={{ padding: 10, borderBottomWidth: 1 }}
          >
            <Text>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ChatList;
