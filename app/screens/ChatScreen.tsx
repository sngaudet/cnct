import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Button,
  Text,
  StyleSheet,
} from "react-native";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  getDocs,
  where,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../FirebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "../navigation/types";

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: Timestamp;
};

type Props = NativeStackScreenProps<InsideStackParamList, "ChatScreen">;

const ChatScreen = ({ route }: Props) => {
  const { chatId: initialChatId, userId } = route.params;
  const currentUser = FIREBASE_AUTH.currentUser;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(initialChatId);

  useEffect(() => {
    const setupChat = async () => {
      if (chatId) {
        listenForMessages(chatId);
      } else {
        // Check if a chat already exists between these users
        const chatsRef = collection(FIRESTORE_DB, "chats");
        const q = query(
          chatsRef,
          where("users", "in", [
            [currentUser?.uid, userId],
            [userId, currentUser?.uid],
          ])
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const existingChat = snapshot.docs[0];
          setChatId(existingChat.id);
          listenForMessages(existingChat.id);
        } else {
          // Create new chat
          const newChatRef = await addDoc(chatsRef, {
            users: [currentUser?.uid, userId],
            createdAt: Timestamp.now(),
          });
          setChatId(newChatRef.id);
          listenForMessages(newChatRef.id);
        }
      }
    };

    const listenForMessages = (cid: string) => {
      const messagesRef = collection(FIRESTORE_DB, "chats", cid, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Message, "id">),
        }));
        setMessages(msgs);
      });

      return unsubscribe;
    };

    setupChat();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !chatId || !currentUser) return;

    const messagesRef = collection(FIRESTORE_DB, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      text: input,
      senderId: currentUser.uid,
      createdAt: Timestamp.now(),
    });

    setInput("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={
              item.senderId === currentUser?.uid ? styles.sent : styles.received
            }
          >
            {item.text}
          </Text>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput value={input} onChangeText={setInput} style={styles.input} />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center" },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C5",
    marginVertical: 4,
    padding: 8,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#EEE",
    marginVertical: 4,
    padding: 8,
  },
});

export default ChatScreen;
