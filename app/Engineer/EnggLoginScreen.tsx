import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
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
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    if (loginSuccess) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loginSuccess]);

  const handleLogin = async () => {
    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
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
        setErrorMessage("Invalid server response format");
        setIsLoading(false);
        return;
      }

      if (data?.status === "success") {
        if (rememberMe) {
          await AsyncStorage.setItem("engg_username", username);
          await AsyncStorage.setItem("engg_password", password);
          await AsyncStorage.setItem("engg_rememberMe", "true");
        } else {
          await AsyncStorage.removeItem("engg_username");
          await AsyncStorage.removeItem("engg_password");
          await AsyncStorage.removeItem("engg_rememberMe");
        }
        
        setLoginSuccess(true);
        setTimeout(() => {
          navigation.navigate("Engineer/EnggListofcomplaint", {
            username: username,
            password: password,
          });
        }, 1500);
      } else {
        setErrorMessage(data?.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const shimmerStyle = {
    transform: [{
      translateX: shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [-200, 200],
      }),
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LogoHeader />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>ENGINEER LOGIN</Text>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!isLoading}
          />
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.rememberMeContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <MaterialIcons
            name={rememberMe ? "check-box" : "check-box-outline-blank"}
            size={24}
            color="#0066CC"
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {loginSuccess ? (
            <View style={styles.successContainer}>
              <Animated.View style={[styles.shimmer, shimmerStyle]} />
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
              <Text style={styles.successText}>Login Successful!</Text>
            </View>
          ) : (
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
          )}
        </View>
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
    marginHorizontal: 16,
    marginTop: 40,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0066CC',
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  loginButton: {
    backgroundColor: "#0066CC",
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
    color: "#666",
  },
  buttonContainer: {
    height: 50,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    padding: 14,
    borderRadius: 8,
    overflow: "hidden",
  },
  successText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 200,
  },
}); 