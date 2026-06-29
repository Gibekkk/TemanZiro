import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useTheme } from "@/controllers/hooks/useTheme";
import TabIcon from "@/views/components/UI/TabIcon/TabIcon";
import UserProfile from "@/views/components/UI/UserProfile/UserProfile";

import DashboardActive from "@/assets/icon/home-active.svg";
import DashboardInactive from "@/assets/icon/home.svg";

import TemanJalanActive from "@/assets/icon/friendswhite.svg";
import TemanJalanInactive from "@/assets/icon/friendsnon.svg";

import ChatActive from "@/assets/icon/chat-active.svg";
import ChatInactive from "@/assets/icon/chat.svg";

export default function TabLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 26,
          borderBottomRightRadius: 26,
          borderTopWidth: 0,
          height: 90,
          marginHorizontal: 15,
          marginBottom: 30,
        },
        tabBarActiveTintColor: theme.colors.lightText,
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(dashboard)/dashboard"
        options={{
          title: "Dashboard",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ActiveIcon={DashboardActive}
              InactiveIcon={DashboardInactive}
              label="Home"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(temanjalan)/temanjalan"
        options={{
          title: "Teman Jalan",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ActiveIcon={TemanJalanActive}
              InactiveIcon={TemanJalanInactive}
              label="Teman"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(listchat)/listchat"
        options={{
          title: "Chat",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              ActiveIcon={ChatActive}
              InactiveIcon={ChatInactive}
              label="Chat"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)/profile"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Profil"
              isProfile={true}
            />
          ),
        }}
      />
    </Tabs>
  );
}
