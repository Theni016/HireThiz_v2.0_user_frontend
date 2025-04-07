import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Import icons
import FindTripIcon from "../assets/images/find_trip.png";
import ProfileIcon from "../assets/images/profile.png";
import ChatIcon from "../assets/images/chatbot.png";
import LogoutIcon from "../assets/images/logout.png";
import PassengerLogo from "../assets/images/dark_bg.png";

type RootStackParamList = {
  GetStarted: undefined;
  PassengerProfile: undefined;
  ThizzyScreen: undefined;
  FindTrip: undefined;
  BookedTrip: undefined;
};

const { width } = Dimensions.get("window");
const TILE_SIZE = (width - 60) / 2;

// Navigation type
type GetStartedNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "GetStarted"
>;

const PassengerMenu = () => {
  const navigation = useNavigation<GetStartedNavProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.navigate("GetStarted");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#3E0E12", "#1E0406"]} style={styles.container}>
      {/* Logo */}
      <Image source={PassengerLogo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Passenger Menu</Text>

      <ScrollView contentContainerStyle={styles.tilesWrapper}>
        {/* Find a Trip */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("FindTrip")}
        >
          <LinearGradient
            colors={["#4facfe", "#00f2fe"]} // Blue gradient
            style={styles.tile}
          >
            <Image
              source={FindTripIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Find a Trip</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* View Profile */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("PassengerProfile")}
        >
          <LinearGradient
            colors={["#fa709a", "#fee140"]} // Pink-yellow gradient
            style={styles.tile}
          >
            <Image
              source={ProfileIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>View Profile</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Chat with Thizzy */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("ThizzyScreen")}
        >
          <LinearGradient
            colors={["#fddb92", "#d1fdff"]} // Light yellow-blue gradient
            style={styles.tile}
          >
            <Image source={ChatIcon} style={styles.icon} resizeMode="contain" />
            <Text style={styles.tileText}>Chat with Thizzy</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* My Trips */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={() => navigation.navigate("BookedTrip")}
        >
          <LinearGradient
            colors={["#43e97b", "#38f9d7"]} // Green gradient
            style={styles.tile}
          >
            <Image
              source={FindTripIcon} // Or a separate icon if available
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>My Trips</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.tileWrapper}
          onPress={handleLogout}
        >
          <LinearGradient
            colors={["#ff6f61", "#d72638"]} // Red danger gradient
            style={styles.tile}
          >
            <Image
              source={LogoutIcon}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.tileText}>Log Out</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default PassengerMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Poppins-Bold",
  },
  tilesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  tileWrapper: {
    marginBottom: 20,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  tileText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
});
