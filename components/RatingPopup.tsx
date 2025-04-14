// components/RatingPopup.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RatingPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (stars: number) => void;
}

const getEmojiFeedback = (stars: number) => {
  switch (stars) {
    case 1:
      return { emoji: "😡", text: "Very Bad" };
    case 2:
      return { emoji: "😞", text: "Bad" };
    case 3:
      return { emoji: "😐", text: "Average" };
    case 4:
      return { emoji: "😊", text: "Good" };
    case 5:
      return { emoji: "😍", text: "Excellent" };
    default:
      return { emoji: "", text: "Rate the driver" };
  }
};

const RatingPopup: React.FC<RatingPopupProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [stars, setStars] = useState<number>(0);

  useEffect(() => {
    if (!visible) setStars(0);
  }, [visible]);

  const { emoji, text } = getEmojiFeedback(stars);

  const handleSubmit = () => {
    if (stars === 0) return;
    onSubmit(stars);
    setStars(0);
    onClose(); // Close the popup after submitting
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Rate the Driver</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((i) => (
              <TouchableOpacity key={i} onPress={() => setStars(i)}>
                <FontAwesome
                  name={i <= stars ? "star" : "star-o"}
                  size={32}
                  color="#FFD700"
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.feedbackText}>{text}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: stars > 0 ? "#28a745" : "#888" },
              ]}
              onPress={handleSubmit}
              disabled={stars === 0}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RatingPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 300,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: "row",
    marginVertical: 10,
  },
  starIcon: {
    marginHorizontal: 5,
  },
  emoji: {
    fontSize: 40,
    marginTop: 10,
  },
  feedbackText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#dc3545",
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  submitBtn: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
