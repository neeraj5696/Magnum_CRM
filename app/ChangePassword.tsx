import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import LogoHeader from "./LogoHeader"; // Imported LogoHeader component

export default function ChangePasswordScreen() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const navigation = useNavigation();

  const handleSubmit = () => {
    console.log("Change Password for:", username);
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    // Implement your password change logic here
  };

  return (
    <View style={{ flex: 1, backgroundColor: "rgba(16, 156, 250, 0.94)" }}>
      {/* Independent Logo Section */}
      <SafeAreaView style={styles.logoContainer}>
        <LogoHeader />
      </SafeAreaView>

      {/* Main Content Section */}
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>
            Change Your Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.copyrightText}>
          <Text>Copyright @ Magnum Telesystem Pvt. Ltd.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
  },

  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },

  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
  },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  copyrightText: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
});
