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
  const [rated, setRated] = useState<boolean>(hasRated);

  const statusColor = getStatusColor(trip.status);

  const handleRate = () => {
    onRateDriver(() => setRated(true));
  };

  return (
    <View style={styles.cardWrapper}>
      <LinearGradient colors={["#000428", "#004e92"]} style={styles.card}>
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

        <View style={styles.statusTag}>
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
              onPress={handleRate}
              style={styles.innerButton}
              disabled={rated}
            >
              <Text style={styles.buttonText}>
                {rated ? "Rated" : "Rate Driver"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={["#ff6f61", "#d72638"]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={onReportDriver}
              style={styles.innerButton}
              disabled={hasReported}
            >
              <Text style={styles.buttonText}>
                {hasReported ? "Reported" : "Report Driver"}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
};

export default BookedTripCard;

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  tripTitle: {
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    color: "#ffffff",
    fontSize: 16,
  },
  statusTag: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  statusText: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    color: "#fff",
    fontWeight: "bold",
    overflow: "hidden",
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  gradientButton: {
    borderRadius: 30,
    width: "48%",
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
