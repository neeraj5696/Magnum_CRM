// LogoHeader.js
import React from "react";
import { View, Image, StyleSheet } from "react-native";

export default function LogoHeader() {
  return (
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
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 5,
    marginTop: 40, // Ensures same positioning on both screens
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },
  logoo: {
    width: 180,
    height: 110,
    resizeMode: "contain",
  },
});


