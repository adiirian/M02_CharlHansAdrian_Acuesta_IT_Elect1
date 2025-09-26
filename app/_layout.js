import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="messenger" options={{ title: 'Messenger' }} />
      <Tabs.Screen name="comments" options={{ title: 'Comments' }} />
    </Tabs>
  );
}

//this is the App.js alternative for expo-router on my Midterm Activity 1