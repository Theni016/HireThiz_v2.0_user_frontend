import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  GetStarted: undefined;
  PassengerProfile: undefined;
  ThizzyScreen: undefined;
  FindTrip: undefined;
};

// Define the type for useNavigation
type GetStartedNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

const PassengerMenu = () => {
  const navigation = useNavigation<GetStartedNavProp>();

  // Handle logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("GetStarted");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passenger Menu</Text>

      {/* Button to Find a trip */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FindTrip")}
      >
        <Text style={styles.buttonText}>Find a Trip</Text>
      </TouchableOpacity>

      {/* Button to View profile */}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("PassengerProfile")}
      >
        <Text style={styles.buttonText}>View Profile</Text>
      </TouchableOpacity>

      {/* Button to chat with Thizzy*/}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ThizzyScreen")}
      >
        <Text style={styles.buttonText}>Chat with Thizzy</Text>
      </TouchableOpacity>

      {/* Button to Logout*/}
      <TouchableOpacity style={styles.dangerbutton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PassengerMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    width: 250,
    padding: 15,
    margin: 10,
    backgroundColor: "#007bff",
    alignItems: "center",
    borderRadius: 10,
  },
  dangerbutton: {
    width: 250,
    padding: 15,
    margin: 10,
    backgroundColor: "#dc3545",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
