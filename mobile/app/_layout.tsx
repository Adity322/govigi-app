import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="products" />
      <Stack.Screen name="place-order" />
      <Stack.Screen name="my-orders" />
    </Stack>
  );
}