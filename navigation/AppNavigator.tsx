import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
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

// 🔹 Create Auth Context
type User = {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
};

interface AuthContextType {
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Create Auth Provider Component
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // 🔹 Check if the user is logged in
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData)); // Restore user data
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  // 🔹 Login function (store user & token)
  const login = async (userData: User, token: string) => {
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🔹 Logout function (clear storage)
  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
    </AuthContext.Provider>
  );
};

export default AppNavigator;
