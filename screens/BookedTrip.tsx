import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TripCard from "@/components/TripCard";
import { LinearGradient } from "expo-linear-gradient";

type Trip = {
  id: string;
  startLocation: { latitude: number; longitude: number; address: string };
  destination: { latitude: number; longitude: number; address: string };
  seatsAvailable: number;
  pricePerSeat: number;
  date: string;
  description: string;
  driverName: string;
  vehicle: string;
  rating: number;
};

const BookedTrip = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedTrips = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated");
          return;
        }
        const response = await axios.get(
          "http://192.168.8.140:5000/api/bookings/mine", // Replace with your actual API route
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const formattedTrips = response.data.map((booking: any) => ({
          ...booking.trip,
          id: booking.trip._id,
        }));

        setTrips(formattedTrips);
      } catch (error) {
        console.error("Fetch booked trips error:", error);
        Alert.alert("Error", "Failed to load booked trips");
      } finally {
        setLoading(false);
      }
    };

    fetchBookedTrips();
  }, []);

  return (
    <LinearGradient
      colors={["#3E0E12", "#1E0406"]}
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>My Booked Trips</Text>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={styles.loader}
          />
        ) : trips.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {trips.map((trip) => (
              <TripCard key={String(trip.id)} trip={trip} />
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noTripsText}>No booked trips found.</Text>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default BookedTrip;

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
  },
  loader: {
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  noTripsText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 40,
    color: "#ffffff",
  },
});
