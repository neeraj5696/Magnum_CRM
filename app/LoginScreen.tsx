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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <LogoHeader />
        <View style={styles.container}>
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
                color="#1a73e8"
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        
      </View>
     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    top: 0,
  },
  background: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '92%',
    marginTop: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    flex: 1,
    justifyContent: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1a73e8',
  },
  input: {
    width: '100%',
    borderWidth: 2,
    borderColor: '#e8eaed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  rememberMeText: {
    color: '#202124',
    fontSize: 16,
    marginLeft: 12,
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  copyrightText: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  copyrightTextStyle: {
    color: '#5f6368',
    fontSize: 14,
  },
});
