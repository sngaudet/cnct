// app/screens/ChatList.tsx
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { InsideStackParamList } from "../navigation/types";

type NavigationProp = NativeStackNavigationProp<InsideStackParamList, "ChatScreen">;

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
    const fetchAndSetMatch = async () => {
      if (!currentUser) return;

      const usersRef = collection(FIRESTORE_DB, "users");

      // Step 1: Get current user data
      const currentUserSnapshot = await getDocs(
        query(usersRef, where("email", "==", currentUser.email))
      );
      if (currentUserSnapshot.empty) return;

      const currentUserDoc = currentUserSnapshot.docs[0];
      const currentUserData = currentUserDoc.data();
      const currentUserId = currentUserDoc.id;
      const currentUserHobbies: string[] = currentUserData.hobbies || [];
      const currentPrefs = currentUserData.preferences || {};
      const existingMatch = currentUserData.match;

      if (existingMatch && existingMatch.userId) {
        // A match already exists, show just that user
        const matchedUserDoc = await getDoc(doc(FIRESTORE_DB, "users", existingMatch.userId));
        if (matchedUserDoc.exists()) {
          const matchedUserData = matchedUserDoc.data();
          const sharedHobbies = currentUserHobbies.filter((hobby) =>
            (matchedUserData.hobbies || []).includes(hobby)
          );

          setUsers([
            {
              id: matchedUserDoc.id,
              email: matchedUserData.email,
              sharedHobbies: sharedHobbies.length,
            },
          ]);
        }
        return;
      }

      // Step 2: Fetch all other users
      const snapshot = await getDocs(
        query(usersRef, where("email", "!=", currentUser.email))
      );

      const potentialMatches: User[] = [];

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const otherUserHobbies: string[] = data.hobbies || [];

        const shared = currentUserHobbies.filter((hobby) =>
          otherUserHobbies.includes(hobby)
        );
        if (shared.length === 0) return;

        if (
          currentPrefs.allowsDrinking === false &&
          (data.drinker === "Yes" || data.drinker === "Occasionally")
        ) {
          return;
        }

        if (
          currentPrefs.allowsSmoking === false &&
          (data.smoker === "Yes" || data.smoker === "Occasionally")
        ) {
          return;
        }

        if (
          currentPrefs.religionImportant === true &&
          currentPrefs.preferredReligion &&
          data.religion !== currentPrefs.preferredReligion
        ) {
          return;
        }

        potentialMatches.push({
          id: docSnap.id,
          email: data.email,
          sharedHobbies: shared.length,
        });
      });

      potentialMatches.sort((a, b) => b.sharedHobbies - a.sharedHobbies);

      if (potentialMatches.length > 0) {
        const bestMatch = potentialMatches[0];
        const matchTimestamp = new Date();

        // Save match to current user
        await updateDoc(doc(FIRESTORE_DB, "users", currentUserId), {
          match: {
            userId: bestMatch.id,
            matchedAt: matchTimestamp,
          },
        });

        // Save match to matched user
        await updateDoc(doc(FIRESTORE_DB, "users", bestMatch.id), {
          match: {
            userId: currentUserId,
            matchedAt: matchTimestamp,
          },
        });

        setUsers([bestMatch]);
      } else {
        setUsers([]); // no matches
      }
    };

    fetchAndSetMatch();
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
        Your match:
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
        ListEmptyComponent={<Text>No match found yet.</Text>}
      />
    </View>
  );
};

export default ChatList;
