import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProps } from "./types"; // Import the types
import { SafeAreaView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Icon for custom checkbox
import LogoHeader from "./LogoHeader"; // Imported LogoHeader component

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Added Remember Me state

  const navigation = useNavigation<NavigationProps>(); // Correct typing for navigation



  const handleLogin = () => {
    console.log("Login pressed with username:", username);
    console.log("Remember Me:", rememberMe); // Added Remember Me log
    navigation.navigate("Listofcomplaint");
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
            Welcome to Samsung Magnum Customer Care
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Remember Me Section */}
          <TouchableOpacity
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <MaterialIcons
              name={rememberMe ? "check-box" : "check-box-outline-blank"}
              size={24}
              color="#000"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
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

  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },

  rememberMeText: {
    color: "#000",
    fontSize: 16,
    marginLeft: 8,
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
