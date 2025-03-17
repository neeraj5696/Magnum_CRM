import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("Login pressed with username:", username);
    navigation.navigate("HomeScreen");
  };

  const handleSignUp = () => {
    console.log("Navigate to Sign Up screen");
    navigation.navigate("SignUpScreen");
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Logo Container */}
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/samsung_logo.png")}
            style={styles.logoo}
          />
          <Image
            source={require("../assets/images/magnum_logo.png")}
            style={styles.logo}
          />
        </View>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={{ width: "100%" }}>
    <TouchableOpacity onPress={handleSignUp}>
        <Text style={[styles.signupText, { textAlign: "right" }]}>
            Sign Up
        </Text>
    </TouchableOpacity>
</View>

      </View>

      {/* Footer Section */}
      <View style={styles.copyrightText}>
        <Text>Copyright @ Magnum Telesystem Pvt. Ltd.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%", // Full height without flex
    backgroundColor: "rgba(16, 156, 250, 0.94)",
    paddingHorizontal: 20,
    paddingVertical: 30,
    position: "relative", // Allows precise positioning
  },

  contentContainer: {
    position: "absolute",
    top: 0, // Start from the very top
    width: "100%",
    alignSelf: 'center',
    alignItems: "center",
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
    gap: 20,
  },

  logo: {
    width: "35%",
    resizeMode: "contain",
  },

  logoo: {
    width: "60%",
    resizeMode: "contain",
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

  signupText: {
    color: "#fff",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 16,
    marginTop: 10,
  },

  copyrightText: {
    position: "absolute",
    bottom: 10, // Pin exactly at the bottom
    alignSelf: "center",
    color: "#fff",
    fontSize: 12,
    opacity: 0.8,
  },
});
