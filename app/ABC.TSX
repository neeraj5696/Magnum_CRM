import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "./types";
import { NavigationProps } from "./types";
import LogoHeader from "./LogoHeader";
import CheckBox from "@react-native-community/checkbox";

type CheckInOutScreenRouteProp = RouteProp<RootStackParamList, "CheckInOut">;

export default function CheckInOut() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<CheckInOutScreenRouteProp>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
   const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      const savedUsername = await AsyncStorage.getItem("username");
      const savedPassword = await AsyncStorage.getItem("password");
      const savedRememberMe = await AsyncStorage.getItem("rememberMe");
      if (savedRememberMe === "true") {
        setUsername(savedUsername || "");
        setPassword(savedPassword || "");
        setRememberMe(true);
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
        "https://hma.magnum.org.in/appEngglogin.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      const responseText = await response.text();
      // console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        Alert.alert("Error", "Invalid server response format");
        return;
      }

      if (data?.status === "success") {
        if(rememberMe){
          await AsyncStorage.setItem("username" ,username)
          await AsyncStorage.setItem("password", password);
          await AsyncStorage.setItem("rememberMe", "true");
        } else{
          //clear the credential if rememberme is not selected

          await AsyncStorage.removeItem("username");
          await AsyncStorage.removeItem("password");
          await AsyncStorage.removeItem("rememerMe")
        }
        Alert.alert("Success", "Login successful!", [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Check", {
                username: username,
                password: password,
                data: undefined,
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
        <Text style={styles.title}>LOGIN </Text>

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

        <View style= {styles.rememberMeContainer} >
          
          <CheckBox 
          value= {rememberMe}
          onValueChange={setRememberMe}
         
          />
          <Text style={styles.rememberMeText}> Remember Me</Text>
        </View>

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
  rememberMeContainer:{

  },
  rememberMeText:{
    
  }
});
