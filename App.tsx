import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./app/screens/Login";
import List from "./app/screens/List";
import RegEmailPass from "./app/screens/RegEmailPass";
import RegProfile from "./app/screens/RegProfile";
import RegHeightWeight from "./app/screens/RegHeightWeight";
import RegPersonalDetails from "./app/screens/RegPersonalDetails";
import Details from "./app/screens/Details";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "./FirebaseConfig";
import {
  InsideStackParamList,
  RootStackParamList,
} from "./app/navigation/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="My Todos" component={List} />
      <InsideStack.Screen name="details" component={Details} />
    </InsideStack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
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
              name="RegProfile"
              component={RegProfile}
              options={{ title: "Your Bio" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
