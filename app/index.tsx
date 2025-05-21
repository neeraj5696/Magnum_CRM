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

  const handleEngineerPress = (event: GestureResponderEvent) => {
    event.persist(); // Prevents event from being nullified
    navigation.navigate("Engineer/EnggLoginScreen", { role: "Engineer" });
  };
  
  const handleCheckInOutPress = (
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

  // New separate handlers for each button
  const handleManagerPress = (event: GestureResponderEvent) => {
    event.persist();
    navigation.navigate("Managerpage", { role: "Manager" });
  };

  const handleAreaManagerPress = (event: GestureResponderEvent) => {
    event.persist();
    navigation.navigate("LoginScreen", { role: "Area Manager" });
  };

  

  const handlePartnerPress = (event: GestureResponderEvent) => {
    event.persist();
    navigation.navigate("LoginScreen", { role: "Partner" });
  };

  const handleAdminPress = (event: GestureResponderEvent) => {
    event.persist();
    navigation.navigate("ChangePassword", { role: "Admin" });
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
          {/* Manager and Area Manager */}
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={handleManagerPress}
            >
              <Image source={require("./../assets/images/manager.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Manager</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={handleAreaManagerPress}
            >
              <Image source={require("./../assets/images/boss.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Area Manager</Text>
            </TouchableOpacity>
          </View>

          {/* Engineer and Partner */}
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={handleEngineerPress}
            >
              <Image source={require("./../assets/images/engineer.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Engineer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={handlePartnerPress}
            >
              <Image source={require("./../assets/images/collaboration.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Partner</Text>
            </TouchableOpacity>
          </View>

          {/* Admin and Check In/Out */}
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={handleAdminPress}
            >
              <Image source={require("./../assets/images/admin.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonSmall}
              onPress={(event) => handleCheckInOutPress(event, "User")}
            >
              <Image source={require("../assets/images/checkinout.png")} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>Check In/Out</Text>
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
    backgroundColor: "#f0f2f5",
  },
  background: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    alignItems: "center",
  },
  headingContainer: {
    width: "90%",
    marginVertical: 14,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: "#1a73e8",
    borderRadius: 14,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a73e8",
    textAlign: "center",
  },
  container: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 16,
    width: "92%",
    marginTop: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  buttonGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop:10,
  },
  buttonSmall: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    height: 120,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: "#e8eaed",
  },
  buttonImageSmall: {
    width: 48,
    height: 48,
    marginBottom: 12,
    resizeMode: "contain",
  },
  buttonTextSmall: {
    fontSize: 18,
    color: "#202124",
    fontWeight: "600",
    textAlign: "center",
  },
});
