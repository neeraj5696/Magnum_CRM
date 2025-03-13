import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('Manager'); // Default value
  const [labelNo, setLabelNo] = useState('1'); // Default value
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    // Implement your login logic here
    console.log('Login:', username, password, selectedLabel);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const buttons = [
    { id: 1, label: 'Manager' },
    { id: 2, label: 'Area Manager' },
    { id: 3, label: 'Engineer' },
    { id: 4, label: 'Partner' },
    { id: 5, label: 'Admin' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/images/samsung_logo.png')} style={styles.logo} />
        <Image source={require('../../assets/images/magnum_logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.welcomeHeading}>Welcome to Magnum</Text>
      <Text style={styles.loginHeading}>Login as {selectedLabel} ({labelNo})</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
        <Text style={styles.dropdownButtonText}>Select {selectedLabel}</Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedLabel}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedLabel(buttons[itemIndex].label);
              setLabelNo(String(buttons[itemIndex].id));
              setIsDropdownOpen(false);
            }}
          >
            {buttons.map((button) => (
              <Picker.Item key={button.id} label={button.label} value={button.label} />
            ))}
          </Picker>
        </View>
      )}

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: 'contain',
  },
  welcomeHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginHeading: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  dropdownButton: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  dropdownButtonText: {
    fontSize: 16,
  },
  dropdownContainer: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});