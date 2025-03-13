import React from "react";
import { Image, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("LoginScreen");
  };

  const buttons = [
    {
      id: 1,
      label: "Manager",
      image: require("../../assets/images/manager.png"),
    },
    {
      id: 2,
      label: "Area Manager",
      image: require("../../assets/images/boss.png"),
    },
    {
      id: 3,
      label: "Engineer",
      image: require("../../assets/images/engineer.png"),
    },
    {
      id: 4,
      label: "Partner",
      image: require("../../assets/images/collaboration.png"),
    },
    { id: 5, label: "Admin", image: require("../../assets/images/admin.png") },
  ];

  return (
    <View style={styles.background}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/samsung_logo.png")}
          style={styles.logoo}
        />
        <Image
          source={require("../../assets/images/magnum_logo.png")}
          style={styles.logo}
        />
      </View>

      <Text style={styles.heading}>Customer Care App</Text>

      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            key={buttons[0].id}
            style={styles.button}
            onPress={handlePress}
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
              onPress={handlePress}
            >
              <Image source={button.image} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmall}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.row}>
          {buttons.slice(3, 5).map((button) => (
            <TouchableOpacity
              key={button.id}
              style={styles.buttonSmall}
              onPress={handlePress}
            >
              <Image source={button.image} style={styles.buttonImageSmall} />
              <Text style={styles.buttonTextSmallWide}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(68, 49, 235, 0.94)", // Consistent background
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 5,
    marginTop: 40,
  },
  logo: {
    width: 120,
    height: 70,
    resizeMode: "contain",
  },
  logoo: {
    width: 160,
    height: 70,
    backgroundColor: "no",
  },
  container: {
    backgroundColor: "rgba(68, 49, 235, 0.94)",
    padding: 10,
    borderRadius: 10,
    width: "89%",
    alignItems: "center",
    // borderWidth: 2,
    //  borderColor: 'black',
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
    backgroundColor: "rgba(68, 49, 235, 0.94)",
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
    backgroundColor: "rgba(68, 49, 235, 0.94)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    borderWidth: 1,
    borderColor: "black",
    height: 100,
    margin: "auto",
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
  buttonImageSmallWide: {
    width: 40, // Adjusted width
    height: 40, // Adjusted height
    marginRight: 10, // Added margin right
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
