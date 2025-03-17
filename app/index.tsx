import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";
import LogoHeader from "./LogoHeader"; // Import the common header

export default function HomeScreen() {
  const navigation = useNavigation();

  const handlePress = (event, role) => {
    event.persist(); // Prevents event from being nullified
    navigation.navigate("LoginScreen", { role });
  };

  const handlePress1 = (event, role) => {
    event.persist(); 
    navigation.navigate("Managerpage", { role });
  };

  const handlePressAdmin = (event, role) => {
    event.persist(); 
    navigation.navigate("ChangePassword", { role });
  };

  const buttons = [
    { id: 1, label: "Manager", image: require("./../assets/images/manager.png") },
    { id: 2, label: "Area Manager", image: require("./../assets/images/boss.png") },
    { id: 3, label: "Engineer", image: require("./../assets/images/engineer.png") },
    { id: 4, label: "Partner", image: require("./../assets/images/collaboration.png") },
    { id: 5, label: "Admin", image: require("./../assets/images/admin.png") },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(16, 156, 250, 0.94)" }}>
      <View style={styles.background}>
        <LogoHeader />

        <Text style={styles.heading}>Customer Care App</Text>

        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity
              key={buttons[0].id}
              style={styles.button}
              onPress={(event) => handlePress1(event, buttons[0].label)}
            >
              <Image source={buttons[0].image} style={styles.buttonImage} />
              <Text style={styles.buttonText}>{buttons[0].label}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {buttons.slice(1, 3).map((button) => (
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

          {/* Separated Partner and Admin */}
          <View style={styles.row}>
            <TouchableOpacity
              key={buttons[3].id}
              style={styles.buttonSmall}
              onPress={(event) => handlePress(event, buttons[3].label)}
            >
              <Image source={buttons[3].image} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmallWide}>{buttons[3].label}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              key={buttons[4].id}
              style={styles.buttonSmall}
              onPress={(event) => handlePressAdmin(event, buttons[4].label)}
            >
              <Image source={buttons[4].image} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmallWide}>{buttons[4].label}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "rgba(16, 156, 250, 0.94)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(16, 156, 250, 0.94)",
    padding: 10,
    borderRadius: 10,
    width: "89%",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "black",
    width: "100%",
    paddingVertical: 8,
    marginBottom: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    resizeMode: "contain",
  },
  button: {
    backgroundColor: "rgba(16, 156, 250, 0.94)",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "black",
    height: 100,
  },
  buttonSmall: {
    backgroundColor: "rgba(16, 156, 250, 0.94)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "black",
    height: 100,
  },
  buttonImage: {
    width: 50,
    height: 50,
    marginBottom: 5,
    resizeMode: "contain",
  },
  buttonImageSmall: {
    width: 40,
    height: 40,
    marginBottom: 5,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
  },
  buttonTextSmall: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  buttonTextSmallWide: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
});
