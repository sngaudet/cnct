// app/navigation/InsideTabs.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatList from "../screens/ChatList";
import List from "../screens/List"; // Assuming List is where you placed the logout button

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="My Match" component={ChatList} />
      <Tab.Screen name="Logout" component={List} />
    </Tab.Navigator>
  );
};

export default Tabs;
