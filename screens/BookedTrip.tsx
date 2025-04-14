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
import RatingPopup from "../components/RatingPopup";

const BookedTrip = () => {
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );

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

  useEffect(() => {
    fetchBookings();
  }, []);

  const submitRating = async (stars: number) => {
    if (!selectedBookingId) return;
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.post(
        "http://192.168.8.140:5000/api/rate-driver",
        {
          bookingId: selectedBookingId,
          rating: stars,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state to disable the button
      setBookedTrips((prevTrips: any) =>
        prevTrips.map((entry: any) =>
          entry.booking._id === selectedBookingId
            ? {
                ...entry,
                booking: { ...entry.booking, hasRated: true },
              }
            : entry
        )
      );

      Alert.alert("Success", "Thank you for your feedback!");
    } catch (error) {
      console.error("Rating error:", error);
      Alert.alert("Error", "Failed to submit rating.");
    } finally {
      setIsRatingVisible(false);
      setSelectedBookingId(null);
    }
  };

  const handleRate = (bookingId: string) => {
    const alreadyRated = bookedTrips.find(
      (entry: any) => entry.booking._id === bookingId && entry.booking.hasRated
    );
    if (alreadyRated) return;
    setSelectedBookingId(bookingId);
    setIsRatingVisible(true);
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
                onRateDriver={() => handleRate(trip._id)}
                onReportDriver={() => handleReport(booking._id)}
                hasRated={booking.hasRated || false}
                hasReported={booking.hasReported || false}
              />
            ))}
          </ScrollView>
        )}
        <RatingPopup
          visible={isRatingVisible}
          onClose={() => setIsRatingVisible(false)}
          onSubmit={submitRating}
        />
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
