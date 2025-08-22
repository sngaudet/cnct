import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
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
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [matchExpiryTime, setMatchExpiryTime] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const currentUser = FIREBASE_AUTH.currentUser;

  useEffect(() => {
    const fetchMatch = async () => {
      if (!currentUser) return;

      const currentUserRef = doc(FIRESTORE_DB, "users", currentUser.uid);
      const currentUserSnap = await getDoc(currentUserRef);
      if (!currentUserSnap.exists()) return;

      const currentUserData = currentUserSnap.data();
      const currentPrefs = currentUserData.preferences || {};
      const currentHobbies: string[] = currentUserData.hobbies || [];
      const previousMatches: string[] = currentUserData.previousMatches || [];

      let matched = currentUserData.match;

      // Check if current match exists and is still valid
      let validMatch = false;
      if (matched?.userId && matched?.matchedAt?.toDate) {
        const matchedAt = matched.matchedAt.toDate();
        const now = new Date();
        const diff = now.getTime() - matchedAt.getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (diff < sevenDays) {
          validMatch = true;

          // Display countdown timer
          const otherUserRef = doc(FIRESTORE_DB, "users", matched.userId);
          const otherUserSnap = await getDoc(otherUserRef);
          if (otherUserSnap.exists()) {
            const otherUserData = otherUserSnap.data();
            const shared = otherUserData.hobbies?.filter((h: string) =>
              currentHobbies.includes(h)
            ).length || 0;

            setMatchedUser({
              id: matched.userId,
              email: otherUserData.email,
              sharedHobbies: shared,
            });

            const updateCountdown = () => {
              const expiration = new Date(matchedAt);
              expiration.setDate(expiration.getDate() + 7);
              const now = new Date();
              const diff = expiration.getTime() - now.getTime();

              if (diff <= 0) {
                setMatchExpiryTime("Expired");
                return;
              }

              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
              const minutes = Math.floor((diff / (1000 * 60)) % 60);
              const seconds = Math.floor((diff / 1000) % 60);

              setMatchExpiryTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);
            return () => clearInterval(interval);
          }
        }
      }

      // If not valid, archive old match to previousMatches
      if (!validMatch && matched?.userId) {
        await updateDoc(currentUserRef, {
          previousMatches: arrayUnion(matched.userId),
          match: {}, // clear current match
        });
      }

      // Time to find a new match
      const usersRef = collection(FIRESTORE_DB, "users");
      const snapshot = await getDocs(query(usersRef, where("email", "!=", currentUser.email)));

      let bestMatch: User | null = null;
      let mostShared = 0;

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const candidateId = docSnap.id;

        // Skip previous matches
        if (previousMatches.includes(candidateId)) continue;

        // Preference checks
        if (
          currentPrefs.allowsDrinking === false &&
          (data.drinker === "Yes" || data.drinker === "Occasionally")
        ) continue;

        if (
          currentPrefs.allowsSmoking === false &&
          (data.smoker === "Yes" || data.smoker === "Occasionally")
        ) continue;

        if (
          currentPrefs.religionImportant &&
          currentPrefs.preferredReligion &&
          data.religion !== currentPrefs.preferredReligion
        ) continue;

        // Hobbies check
        const otherHobbies: string[] = data.hobbies || [];
        const shared = currentHobbies.filter((hobby) => otherHobbies.includes(hobby));
        if (shared.length > mostShared) {
          mostShared = shared.length;
          bestMatch = {
            id: candidateId,
            email: data.email,
            sharedHobbies: shared.length,
          };
        }
      }

      if (bestMatch) {
        await updateDoc(currentUserRef, {
          match: {
            userId: bestMatch.id,
            matchedAt: new Date(),
          },
        });

        setMatchedUser(bestMatch);

        const updateCountdown = () => {
          const expiration = new Date();
          expiration.setDate(expiration.getDate() + 7);
          const now = new Date();
          const diff = expiration.getTime() - now.getTime();

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          setMatchExpiryTime(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
      }
    };

    fetchMatch();
  }, []);

  const handleUserPress = () => {
    if (!matchedUser) return;
    navigation.navigate("ChatScreen", {
      chatId: null,
      userId: matchedUser.id,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Your current match:</Text>

      {matchExpiryTime && (
        <Text style={{ color: "green", marginBottom: 10 }}>
          Time left: {matchExpiryTime}
        </Text>
      )}

      {matchedUser ? (
        <TouchableOpacity
          onPress={handleUserPress}
          style={{ padding: 10, borderBottomWidth: 1 }}
        >
          <Text>{matchedUser.email}</Text>
          <Text style={{ color: "gray" }}>
            Shared hobbies: {matchedUser.sharedHobbies}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text>No match available.</Text>
      )}
    </View>
  );
};

export default ChatList;
