// app/navigation/Tabs.tsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatList from "../screens/ChatList";
import ChatScreen from "../screens/ChatScreen";
import Details from "../screens/Details";
import Logout from "./Logout";
import { InsideStackParamList } from "./types";

const Tab = createBottomTabNavigator();
const InsideStack = createNativeStackNavigator<InsideStackParamList>();

// Stack for screens that need to be pushed (like chat details)
const InsideStackScreen = () => (
  <InsideStack.Navigator>
    <InsideStack.Screen name="ChatList" component={ChatList} />
    <InsideStack.Screen name="ChatScreen" component={ChatScreen} />
    <InsideStack.Screen name="details" component={Details} />
  </InsideStack.Navigator>
);

const Tabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="My Match" component={InsideStackScreen} />
      <Tab.Screen name="Logout" component={Logout} />
    </Tab.Navigator>
  );
};

export default Tabs;
