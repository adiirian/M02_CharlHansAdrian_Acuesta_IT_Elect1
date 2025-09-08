import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="messenger" options={{ title: 'Messenger' }} />
      <Tabs.Screen name="comments" options={{ title: 'Comments' }} />
    </Tabs>
  );
}
