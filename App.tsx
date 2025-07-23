import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "./FirebaseConfig";
import Tabs from "./app/navigation/Tabs";
import {
  InsideStackParamList,
  RootStackParamList,
} from "./app/navigation/types";
import ChatList from "./app/screens/ChatList";
import ChatScreen from "./app/screens/ChatScreen";
import Details from "./app/screens/Details";
import List from "./app/screens/List";
import Login from "./app/screens/Login";
import RegEmailPass from "./app/screens/RegEmailPass";
import RegHeightWeight from "./app/screens/RegHeightWeight";
import RegHobbies from "./app/screens/RegHobbies";
import RegLocation from "./app/screens/RegLocation";
import RegPersonalDetails from "./app/screens/RegPersonalDetails";
import RegPreferences from "./app/screens/RegPreferences";
import RegProfile from "./app/screens/RegProfile";

const Stack = createNativeStackNavigator<RootStackParamList>();

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="CNCT" component={List} />
      <InsideStack.Screen name="details" component={Details} />
      <InsideStack.Screen name="ChatList" component={ChatList} />
      <InsideStack.Screen name="ChatScreen" component={ChatScreen} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(FIRESTORE_DB, "users", user.uid));
          if (userDoc.exists() && userDoc.data().profileComplete) {
            setUser(user);
          } else {
            setUser(null); // Don't treat them as fully registered yet
          }
        } catch (err) {
          console.error("Error checking profileComplete:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={Tabs}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="RegEmailPass"
              component={RegEmailPass}
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="RegHeightWeight"
              component={RegHeightWeight}
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="RegPersonalDetails"
              component={RegPersonalDetails}
              options={{ title: "Register" }}
            />
            <Stack.Screen
              name="RegHobbies"
              component={RegHobbies}
              options={{ title: "Hobbies" }}
            />
            <Stack.Screen
              name="RegLocation"
              component={RegLocation}
              options={{ title: "Location" }}
            />
            <Stack.Screen
              name="RegProfile"
              component={RegProfile}
              options={{ title: "Your Bio" }}
            />
            <Stack.Screen
  name="RegPreferences"
  component={RegPreferences}
  options={{ title: "Preferences" }}
/>

          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
