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
import MyTripIcon from "../assets/images/mytrips.png"

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

  const renderTile = (
    icon: any,
    label: string,

    onPress: () => void
  ) => (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.tileWrapper}
    >
      <LinearGradient colors={["#ff6f61", "#d72638"]} style={styles.tileButton}>
        <View style={styles.tileContent}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
          <Text style={styles.buttonText}>{label}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#3E0E12", "#1E0406"]} style={styles.container}>
      {/* Logo */}
      <Image source={PassengerLogo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Passenger Menu</Text>

      <ScrollView contentContainerStyle={styles.tilesWrapper}>
        {renderTile(FindTripIcon, "Find a Trip", () =>
          navigation.navigate("FindTrip")
        )}
        {renderTile(ProfileIcon, "View Profile", () =>
          navigation.navigate("PassengerProfile")
        )}
        {renderTile(ChatIcon, "Chat with Thizzy", () =>
          navigation.navigate("ThizzyScreen")
        )}
        {renderTile(MyTripIcon, "My Trips", () =>
          navigation.navigate("BookedTrip")
        )}

        {/* Logout Tile (Styled like 'Back to Menu') */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleLogout}>
          <LinearGradient
            colors={["#b00020", "#8e0016"]} // deeper red gradient
            style={[styles.tileButton]}
          >
            <View style={styles.tileContent}>
              <Image
                source={LogoutIcon}
                style={styles.icon}
                resizeMode="contain"
              />
              <Text style={styles.buttonText}>Log Out</Text>
            </View>
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
    paddingBottom: 30,
  },
  tileWrapper: {
    marginBottom: 20,
  },
  tileButton: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  tileContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  logo: {
    width: 250,
    height: 150,
    alignSelf: "center",
    marginBottom: 30,
  },
});
