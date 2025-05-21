import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../types";
import { NavigationProps } from "../types";
import LogoHeader from "../LogoHeader";
import { MaterialIcons } from "@expo/vector-icons";

type EnggLoginScreenRouteProp = RouteProp<RootStackParamList, "Engineer/EnggLoginScreen">;

export default function EnggLoginScreen() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<EnggLoginScreenRouteProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("engg_username");
        const savedPassword = await AsyncStorage.getItem("engg_password");
        const savedRememberMe = await AsyncStorage.getItem("engg_rememberMe");
        
        if (savedRememberMe === "true") {
          setUsername(savedUsername || "");
          setPassword(savedPassword || "");
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved credentials:", error);
      }
    };
    loadCredentials();
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password");
      return;
    }

    setIsLoading(true);

    try {
      // Create URLSearchParams object for form data
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch(
        "https://hma.magnum.org.in/appMEngglogin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        Alert.alert("Error", "Invalid server response format");
        setIsLoading(false);
        return;
      }

      if (data?.status === "success") {
        if (rememberMe) {
          await AsyncStorage.setItem("engg_username", username);
          await AsyncStorage.setItem("engg_password", password);
          await AsyncStorage.setItem("engg_rememberMe", "true");
        } else {
          // Clear credentials if remember me is not selected
          await AsyncStorage.removeItem("engg_username");
          await AsyncStorage.removeItem("engg_password");
          await AsyncStorage.removeItem("engg_rememberMe");
        }
        
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Engineer/EnggListofcomplaint", {
                username: username,
                password: password,
              }),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          data?.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoHeader />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>ENGINEER LOGIN</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!isLoading}
        />

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

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "flex-start",
    paddingTop: 0,
  },
  logoContainer: {
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "white",
    marginHorizontal: 10,
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  loginButtonDisabled: {
    backgroundColor: "#999",
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rememberMeText: {
    marginLeft: 8,
    fontSize: 14,
  },
}); 