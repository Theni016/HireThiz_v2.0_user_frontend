// components/BookedTripCard.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return styles.completed;
    case "cancelled":
      return styles.cancelled;
    case "ongoing":
      return styles.ongoing;
    default:
      return {};
  }
};

interface BookedTripCardProps {
  trip: any;
  booking: any;
  onRateDriver: () => void;
  onReportDriver: () => void;
  hasRated: boolean;
  hasReported: boolean;
}

const BookedTripCard: React.FC<BookedTripCardProps> = ({
  trip,
  booking,
  onRateDriver,
  onReportDriver,
  hasRated,
  hasReported,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{trip.driverName}</Text>
      <Text>Vehicle: {trip.vehicle}</Text>
      <Text>From: {trip.startLocation.address}</Text>
      <Text>To: {trip.destination.address}</Text>
      <Text>Date: {new Date(trip.date).toLocaleDateString()}</Text>
      <Text>Seats Booked: {booking.seatsBooked}</Text>
      <Text>Total Amount: Rs. {booking.totalAmount}</Text>
      <Text>
        Status:{" "}
        <Text style={[styles.status, getStatusStyle(trip.status)]}>
          {" "}
          {trip.status}
        </Text>
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={hasReported}
          onPress={onReportDriver}
          style={[styles.button, hasReported && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>
            {hasReported ? "Reported" : "Report Driver"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={hasRated}
          onPress={onRateDriver}
          style={[styles.button, hasRated && styles.disabledButton]}
        >
          <Text style={styles.buttonText}>
            {hasRated ? "Rated" : "Rate Driver"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    fontWeight: "bold",
  },
  completed: { color: "green" },
  cancelled: { color: "red" },
  ongoing: { color: "orange" },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#004e92",
    padding: 10,
    borderRadius: 10,
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "gray",
  },
});

export default BookedTripCard;
