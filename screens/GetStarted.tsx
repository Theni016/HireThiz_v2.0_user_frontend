import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types.js";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

const GetStarted = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <LinearGradient
      // User-friendly Passenger app colors: blue-green gradient
      colors={["#3E0E12", "#1E0406"]}
      style={styles.container}
    >
      {/* Logo Image for Passenger App */}
      <Image
        source={require("../assets/images/dark_bg.png")} // Add your passenger logo here
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Optional welcome text */}
      {/* <Text style={styles.text}>Welcome to HireThiz!</Text> */}

      <TouchableOpacity
        onPress={() => navigation.navigate("PassengerLoginAndSignUp")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#ff6f61", "#d72638"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#210b0e", // fallback color
    padding: 20,
  },
  logo: {
    width: 300,
    height: 200,
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    fontFamily: "",
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
  },
});

export default GetStarted;
