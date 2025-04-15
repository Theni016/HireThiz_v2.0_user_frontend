import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { useAuth } from "../navigation/AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SuccessPopup from "./SuccessPopup";

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

interface TripCardProps {
  trip: Trip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [seats, setSeats] = useState("1");
  const [confirmModal, setConfirmModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const extractDistrict = (address: string): string => {
    if (!address) return "";
    const parts = address.split(",").map((part) => part.trim());
    return parts.length >= 3 ? parts[parts.length - 2] : parts[1] || parts[0];
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const startDistrict = extractDistrict(trip.startLocation.address);
  const destinationDistrict = extractDistrict(trip.destination.address);
  const formattedDate = formatDate(trip.date);

  const handleBookNow = () => setModalVisible(true);

  const handleConfirmSeats = () => {
    const price = parseInt(seats) * trip.pricePerSeat;
    setTotalPrice(price);
    setConfirmModal(true);
    setModalVisible(false);
  };

  const handleFinalBooking = async () => {
    try {
      const totalAmount = parseInt(seats) * trip.pricePerSeat;

      const payload = {
        tripId: trip.id,
        seatsBooked: parseInt(seats),
        totalAmount,
      };

      const token = await AsyncStorage.getItem("token");
      console.log("Token:", token);
      console.log("Booking Payload:", payload); // Log payload before sending

      if (!token) {
        console.error("Token not found in AsyncStorage");
      }

      const response = await axios.post(
        "http://192.168.8.140:5000/api/book-trip",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Booking Response:", response.data); // Log API response

      if (response.data.success) {
        setConfirmModal(false);
        setShowSuccessPopup(true);
      } else {
        Alert.alert("Booking Failed", response.data.message);
      }
    } catch (error) {
      console.error("Booking Error:", error); // Log full error details
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.tripTitle}>
        {startDistrict} → {destinationDistrict}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Seats:</Text>
        <Text style={styles.value}>{trip.seatsAvailable}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Price/Seat:</Text>
        <Text style={styles.value}>Rs. {trip.pricePerSeat}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{formattedDate}</Text>
      </View>

      <Text style={styles.description}>{trip.description}</Text>

      <View style={styles.divider} />

      <Text style={styles.driver}>
        Driver: {trip.driverName} | {trip.vehicle} | ⭐ {trip.rating}
      </Text>

      <View style={styles.buttonRow}>
        <LinearGradient
          colors={["#ff6f61", "#d72638"]}
          style={styles.gradientButton}
        >
          <TouchableOpacity
            style={styles.innerButton}
            onPress={() =>
              Alert.alert("More Info", "Trip details will be shown.")
            }
          >
            <Text style={styles.buttonText}>More Info</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={["#4CAF50", "#388E3C"]}
          style={styles.gradientButton}
        >
          <TouchableOpacity style={styles.innerButton} onPress={handleBookNow}>
            <Text style={styles.buttonText}>Book Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Seat Selection Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Select Seats</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={seats}
              onChangeText={setSeats}
              placeholder="Enter number of seats"
              placeholderTextColor="#ccc"
            />
            <View style={styles.popupButtonContainer}>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => setModalVisible(false)}
              >
                <LinearGradient
                  colors={["#ff6f61", "#d72638"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButtonSeat}
                >
                  <Text style={styles.gradientButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={handleConfirmSeats}
              >
                <LinearGradient
                  colors={["#ff6f61", "#d72638"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButtonSeat}
                >
                  <Text style={styles.gradientButtonText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Booking Confirmation Modal */}
      <Modal visible={confirmModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Confirm Booking</Text>
            <View style={styles.popupInfoContainer}>
              <View style={styles.popupInfoRow}>
                <Text style={styles.popupLabel}>Start:</Text>
                <Text style={styles.popupValue}>
                  {trip.startLocation.address}
                </Text>
              </View>
              <View style={styles.popupInfoRow}>
                <Text style={styles.popupLabel}>Destination:</Text>
                <Text style={styles.popupValue}>
                  {trip.destination.address}
                </Text>
              </View>
              <View style={styles.popupInfoRow}>
                <Text style={styles.popupLabel}>Seats:</Text>
                <Text style={styles.popupValue}>{seats}</Text>
              </View>
              <View style={styles.popupInfoRow}>
                <Text style={styles.popupLabel}>Total Price:</Text>
                <Text style={styles.popupValue}>Rs. {totalPrice}</Text>
              </View>
            </View>
            <View style={styles.popupButtonContainer}>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={() => setConfirmModal(false)}
              >
                <LinearGradient
                  colors={["#ff6f61", "#d72638"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButtonSeat}
                >
                  <Text style={styles.gradientButtonText}>Back</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonWrapper}
                onPress={handleFinalBooking}
              >
                <LinearGradient
                  colors={["#ff6f61", "#d72638"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientButtonSeat}
                >
                  <Text style={styles.gradientButtonText}>Confirm Booking</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <SuccessPopup
        visible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Trip Booking Successful!"
      />
    </View>
  );
};

export default TripCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
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
  label: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  value: { color: "#ffffff", fontSize: 16 },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#d3d3d3",
    lineHeight: 20,
  },
  divider: { height: 1, backgroundColor: "#ffffff50", marginVertical: 15 },
  driver: { fontSize: 14, color: "#ffffff", fontWeight: "600" },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    padding: 10,
    backgroundColor: "#ff6f61",
    borderRadius: 30,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  popup: {
    width: 320,
    padding: 25,
    backgroundColor: "#570c2a",
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  popupTitle: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
  popupInfoContainer: {
    width: "100%",
    marginBottom: 15,
  },

  popupInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  popupLabel: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  popupValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins-Regular",
    textAlign: "right",
    maxWidth: "60%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginBottom: 15,
    color: "#fff",
    backgroundColor: "#3c0d1c",
    fontFamily: "Poppins-Regular",
  },
  popupButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  gradientButton: {
    borderRadius: 30,
    width: "48%",
  },
  gradientButtonSeat: {
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8.3,
    elevation: 13,
  },
  innerButton: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 30,
  },
  gradientButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
  },
});
