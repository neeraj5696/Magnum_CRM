import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  GestureResponderEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import LogoHeader from "./LogoHeader"; // Import the common header
import { NavigationProps } from "./types";

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProps>();

  const handlePress = (event: GestureResponderEvent, role: string) => {
    event.persist(); // Prevents event from being nullified
    navigation.navigate("LoginScreen", { role });
  };
  const handlePressCheckInOut = (
    event: GestureResponderEvent,
    role: string
  ) => {
    event.persist(); // Prevents event from being nullified
    navigation.navigate("CheckInOut", { role });
  };

  const handlePress1 = (event: GestureResponderEvent, role: string) => {
    event.persist();
    navigation.navigate("Managerpage", { role });
  };

  const handlePressAdmin = (event: GestureResponderEvent, role: string) => {
    event.persist();
    navigation.navigate("ChangePassword", { role });
  };

  const buttons = [
    {
      id: 1,
      label: "Manager",
      image: require("./../assets/images/manager.png"),
    },
    {
      id: 2,
      label: "Area Manager",
      image: require("./../assets/images/boss.png"),
    },
    {
      id: 3,
      label: "Engineer",
      image: require("./../assets/images/engineer.png"),
    },
    {
      id: 4,
      label: "Partner",
      image: require("./../assets/images/collaboration.png"),
    },
    { id: 5, label: "Admin", image: require("./../assets/images/admin.png") },
    {
      id: 6,
      label: "Check In/Out",
      image: require("../assets/images/checkinout.png"),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.background}>
        <LogoHeader />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Magnum Care App</Text>
        </View>

        <View style={styles.container}>
          <View style={styles.buttonGrid}>
            {buttons.slice(0, 2).map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.buttonSmall}
                onPress={(event) => handlePress(event, button.label)}
              >
                <Image source={button.image} style={styles.buttonImageSmall} />
                <Text style={styles.buttonTextSmall}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonGrid}>
            {buttons.slice(2, 4).map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.buttonSmall}
                onPress={(event) => handlePress(event, button.label)}
              >
                <Image source={button.image} style={styles.buttonImageSmall} />
                <Text style={styles.buttonTextSmall}>{button.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonGrid}>
            {buttons.slice(4, 6).map((button) => (
              <TouchableOpacity
                key={button.id}
                style={styles.buttonSmall}
                onPress={(event) => handlePressCheckInOut(event, button.label)}
              >
                <Image source={button.image} style={styles.buttonImageSmall} />
                <Text style={styles.buttonTextSmall}>{button.label}</Text>
              </TouchableOpacity>
            ))}
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
  },
  background: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
  },
  headingContainer: {
    width: '90%',
    marginVertical: 24,
    paddingVertical: 16,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#1a73e8',
    alignItems: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a73e8',
    textAlign: 'center',
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
  },
  buttonGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  buttonSmall: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    height: 120,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  buttonImageSmall: {
    width: 48,
    height: 48,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  buttonTextSmall: {
    fontSize: 18,
    color: '#202124',
    fontWeight: '600',
    textAlign: 'center',
  },
});
