import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessPopup from "@/components/SuccessPopup";
import { RootStackParamList } from "./types";
import { LinearGradient } from "expo-linear-gradient";
import unsuccess from "../assets/images/unsuccess.png";

// Define the type for useNavigation
type PassengerLoginNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "PassengerMenu"
>;

const PassengerLoginAndSignUp = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successPopupVisible, setSuccessPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const navigation = useNavigation<PassengerLoginNavProp>();

  const resetFields = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setUsername("");
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        "http://192.168.8.140:5000/api/passenger/signup",
        {
          email,
          password,
          phoneNumber,
          username,
        }
      );
      setSuccessPopupVisible(true);
      resetFields();
      setIsLogin(true);
    } catch (error: any) {
      console.error("Sign-up error:", error.response?.data || error.message);
      setErrorPopupVisible(true);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.8.140:5000/api/passenger/login",
        {
          email,
          password,
        }
      );

      await AsyncStorage.setItem("token", response.data.token); // Store token

      // Fetch user details after login
      const profileResponse = await axios.get(
        "http://192.168.8.140:5000/api/passenger/profile",
        {
          headers: { Authorization: response.data.token },
        }
      );

      await AsyncStorage.setItem("user", JSON.stringify(profileResponse.data)); // Store user details

      navigation.navigate("PassengerMenu");
    } catch (error) {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <LinearGradient colors={["#3E0E12", "#1E0406"]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.innerContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../assets/images/dark_bg.png")} // You can update the image path as needed
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>
            {isLogin ? "Passenger Login" : "Passenger Sign Up"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="User Name"
              placeholderTextColor="#ccc"
              value={username}
              onChangeText={setUsername}
            />
          )}

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Mobile Number"
              placeholderTextColor="#ccc"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#ccc"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={isLogin ? handleLogin : handleSignUp}
            style={styles.buttonWrapper}
          >
            <LinearGradient
              colors={["#ff6f61", "#d72638"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>
                {isLogin ? "Login" : "Sign Up"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsLogin(!isLogin);
              resetFields();
            }}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>

          <SuccessPopup
            visible={successPopupVisible}
            onClose={() => {
              setSuccessPopupVisible(false);
              resetFields();
              setIsLogin(true);
            }}
            message="Account Created Successfully!!"
          />

          <SuccessPopup
            visible={errorPopupVisible}
            onClose={() => setErrorPopupVisible(false)}
            icon={unsuccess}
            message="Account Creation Failed!!"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default PassengerLoginAndSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 150,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 300,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  buttonWrapper: {
    width: "50%",
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
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
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  switchText: {
    marginTop: 20,
    color: "#ffffff",
    fontSize: 14,
    textDecorationLine: "underline",
    fontFamily: "Poppins-Regular",
  },
});
