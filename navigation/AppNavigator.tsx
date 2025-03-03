import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GetStarted from "@/screens/GetStarted";
import PassengerLoginAndSignUp from "@/screens/PassengerLoginAndSignUp";
import PassengerMenu from "@/screens/PassengerMenu";
import PassengerProfile from "@/screens/PassengerProfile";
import ThizzyScreen from "@/screens/ThizzyScreen";
import FindTrip from "@/screens/FindTrip";
import { RootStackParamList } from "@/screens/types";

// Define stack navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [userToken, setUserToken] = useState<string | null>(null); // Token state

  // Check if the user is logged in (has a valid token)
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      setUserToken(token); // Set the token if it exists
      setLoading(false); // Stop loading
    };
    checkToken();
  }, []);

  // Show a loading indicator while checking the token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen
        name="PassengerLoginAndSignUp"
        component={PassengerLoginAndSignUp}
      />
      <Stack.Screen name="PassengerMenu" component={PassengerMenu} />
      <Stack.Screen name="PassengerProfile" component={PassengerProfile} />
      <Stack.Screen name="ThizzyScreen" component={ThizzyScreen} />
      <Stack.Screen name="FindTrip" component={FindTrip} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
