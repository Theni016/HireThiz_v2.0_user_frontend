// components/BookedTripCard.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Progress":
      return "#FFA500";
    case "Completed":
      return "#32CD32";
    case "Cancelled":
      return "#FF4747";
    case "Available":
      return "#1E90FF";
    default:
      return "#ccc";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const extractDistrict = (address: string): string => {
  const parts = address.split(",").map((part) => part.trim());
  return parts[parts.length - 2] || parts[0];
};

const BookedTripCard = ({
  trip,
  booking,
  onRateDriver,
  onReportDriver,
  hasRated,
  hasReported,
}: any) => {
  // const [rated, setRated] = useState<boolean>(hasRated);

  const statusColor = getStatusColor(trip.status);

  // const handleRate = () => {
  //   onRateDriver(() => setRated(true));
  // };

  return (
    <View style={styles.card}>
      <Text style={styles.tripTitle}>
        {extractDistrict(trip.startLocation.address)} →{" "}
        {extractDistrict(trip.destination.address)}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formatDate(trip.date)}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Seats Booked:</Text>
        <Text style={styles.value}>{booking.seatsBooked}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Total Paid:</Text>
        <Text style={styles.value}>Rs. {booking.totalAmount}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Driver:</Text>
        <Text style={styles.value}>{trip.driverName}</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={[styles.statusText, { backgroundColor: statusColor }]}>
          {trip.status}
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <LinearGradient
          colors={["#ff6f61", "#d72638"]}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            onPress={onRateDriver}
            style={[styles.innerButton, hasRated && { opacity: 0.6 }]}
            disabled={hasRated}
          >
            <Text style={styles.buttonText}>
              {hasRated ? "Rated" : "Rate Driver"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={["#ff6f61", "#d72638"]}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            onPress={onReportDriver}
            style={[styles.innerButton, hasReported && { opacity: 0.6 }]}
            disabled={hasReported}
          >
            <Text style={styles.buttonText}>
              {hasReported ? "Reported" : "Report Driver"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default BookedTripCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tripTitle: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 12,
    fontFamily: "Poppins-Bold",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  statusContainer: {
    alignItems: "flex-end",
    marginTop: 12,
    marginBottom: 18,
  },

  statusText: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    overflow: "hidden",
    fontFamily: "Poppins-Bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  gradientButton: {
    width: "48%",
    borderRadius: 30,
  },
  innerButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
});
