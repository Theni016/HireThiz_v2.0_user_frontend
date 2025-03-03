import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TripCard from "@/components/TripCard";

type Trip = {
  id: number;
  startLocation: string;
  destination: string;
  seatsAvailable: number;
  pricePerSeat: number;
  date: string;
  description: string;
  driverName: string;
  vehicle: string;
  rating: number;
};

const FindTrip = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated");
          return;
        }

        // Fetch all trips (not just specific to a driver)
        const response = await axios.get("http://192.168.1.5:5000/api/trips", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTrips(response.data);
      } catch (error) {
        console.error("Fetch trips error:", error);
        Alert.alert("Error", "Failed to load trips");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Trip</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading trips...</Text>
      ) : trips.length > 0 ? (
        <ScrollView>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.noTripsText}>No trips found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  noTripsText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});

export default FindTrip;
