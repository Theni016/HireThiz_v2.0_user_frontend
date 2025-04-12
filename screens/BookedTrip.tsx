// screens/BookedTrip.tsx
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BookedTripCard from "../components/BookedTripCard";
import { LinearGradient } from "expo-linear-gradient";

const BookedTrip = () => {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated");
          return;
        }
        const res = await axios.get(
          "http://192.168.8.140:5000/api/booked-trips",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookedTrips(res.data);
      } catch (err) {
        console.log("Error fetching booked trips:", err);
        Alert.alert("Error", "Failed to load booked trips");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleRate = (bookingId: string) => {
    // Send rating API, then disable button
  };

  const handleReport = (bookingId: string) => {
    // Send report API, then disable button
  };

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
        ) : bookedTrips.length === 0 ? (
          <Text style={styles.noTripsText}>No bookings yet.</Text>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {bookedTrips.map(({ trip, booking }: any) => (
              <BookedTripCard
                key={booking._id}
                trip={trip}
                booking={booking}
                onRateDriver={() => handleRate(booking._id)}
                onReportDriver={() => handleReport(booking._id)}
                hasRated={booking.hasRated || false}
                hasReported={booking.hasReported || false}
              />
            ))}
          </ScrollView>
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
