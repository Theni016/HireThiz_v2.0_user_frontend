// screens/BookedTrip.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BookedTripCard from "../components/BookedTripCard";

const BookedTrip = () => {
  const [bookedTrips, setBookedTrips] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("JWT Token:", token);
        const res = await axios.get(
          "http://192.168.8.140:5000/api/booked-trips",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Booked Trips:", res.data);
        setBookedTrips(res.data);
      } catch (err) {
        console.log("Error fetching booked trips:", err);
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
    <ScrollView>
      {bookedTrips.length === 0 ? (
        <Text style={{ padding: 20, textAlign: "center" }}>
          No bookings yet.
        </Text>
      ) : (
        bookedTrips.map(({ trip, booking }: any) => (
          <BookedTripCard
            key={booking._id}
            trip={trip}
            booking={booking}
            onRateDriver={() => handleRate(booking._id)}
            onReportDriver={() => handleReport(booking._id)}
            hasRated={booking.hasRated || false}
            hasReported={booking.hasReported || false}
          />
        ))
      )}
    </ScrollView>
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
