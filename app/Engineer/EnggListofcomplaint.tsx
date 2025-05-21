import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  PanResponder,
  Image,
  Linking,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RootStackParamList, NavigationProps } from "../types";

type EnggListofcomplaintScreenRouteProp = RouteProp<
  RootStackParamList,
  "Engineer/EnggListofcomplaint"
>;

export default function EnggListofcomplaint() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<EnggListofcomplaintScreenRouteProp>();
  const { username, password } = route.params || {};
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComplaints = async () => {
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
        return;
      }

      if (data?.status === "success" && data?.data) {
        setComplaints(data.data);
      } else {
        console.error("No complaint data found");
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username && password) {
      fetchComplaints();
    }
  }, [username, password]);

  // PanResponder for swipe detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures that are significant enough
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const isSignificantMove = Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe && isSignificantMove;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isExpanded && (gestureState.dx > 50 || gestureState.vx > 0.5)) {
          // Swipe right when closed -> open
          setIsExpanded(true);
        } else if (
          isExpanded &&
          (gestureState.dx < -50 || gestureState.vx < -0.5)
        ) {
          // Swipe left when open -> close
          setIsExpanded(false);
        }
      },
    })
  ).current;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          setIsExpanded(false);
          navigation.navigate("Engineer/EnggLoginScreen", { role: "Engineer" });
        },
      },
    ]);
  };

  const handleAboutUs = async () => {
    try {
      const url = "https://www.magnum.org.in";
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Cannot open the URL");
    }
  };

  const handleNavigation = (route: "home" | "Rate") => {
    setIsExpanded(false);
    if (route === "Rate") {
      navigation.navigate("Rate");
    } else if (route === "home") {
      navigation.navigate("index");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("Engineer/EnggComplaintDetails", {
          complaintNo: item.S_SERVNO,
          clientName: item.COMP_NAME,
          status: item.S_jobstatus,
          dateTime: item.S_SERVDT,
          Engineer: item.S_assignedengg,
          Assign_Date: item.S_assigndate,
          Task_Type: item.S_TASK_TYPE,
          Address: item.COMP_ADD1,
          Remark: item.S_REMARK1,
          SYSTEM_NAME: item.SYSTEM_NAME,
        })
      }
    >
      <View style={styles.row}>
        <Text style={styles.label}>Complaint Number : </Text>
        <Text style={styles.text}>{item.S_SERVNO}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Client Name : </Text>
        <Text style={styles.grayText}>{item.COMP_NAME}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Engineer : </Text>
        <Text style={styles.grayText}>{item.S_assignedengg}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status : </Text>
        <Text style={styles.grayText}>{item.S_jobstatus}</Text>
      </View>

      <Text style={styles.datetime}>{item.S_SERVDT}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable
          style={[styles.menuButton]}
          onPress={() => setIsExpanded(!isExpanded)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isExpanded ? "close" : "menu"}
            size={24}
            color="#000"
          />
        </Pressable>
        <Text style={styles.headerTitle}>Engineer Complaints</Text>
        <Pressable
          style={styles.shareButton}
          onPress={handleLogout}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="logout" size={24} color="#000" />
        </Pressable>
      </View>

      <View style={styles.contentContainer}>
        {/* Gesture Area */}
        <View style={styles.gestureArea} {...panResponder.panHandlers} />

        {/* Expanded Navbar */}
        {isExpanded && (
          <View style={styles.expandedNav}>
            <Pressable
              style={styles.overlay}
              onPress={() => setIsExpanded(false)}
            />
            <View style={styles.navContainer}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <View style={styles.stripeContainer}>
                    {Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <View key={index} style={styles.stripe} />
                      ))}
                  </View>
                  <Image
                    source={require("../../assets/images/magnum_logo.png")}
                    style={styles.logoImage}
                  />
                </View>
              </View>

              <Text style={styles.username}>{username || "Engineer"}</Text>

              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.navItemPressed,
                ]}
                onPress={() => handleNavigation("home")}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="home-filled" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>Home</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.navItemPressed,
                ]}
                onPress={() => {
                  setIsExpanded(false);
                  handleAboutUs();
                }}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="language" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>About Us</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.navItemPressed,
                ]}
                onPress={() => handleNavigation("Rate")}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="star-rate" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>Rate Us</Text>
              </Pressable>
            </View>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading complaints...</Text>
          </View>
        ) : complaints.length > 0 ? (
          <FlatList
            data={complaints}
            renderItem={renderItem}
            keyExtractor={(item) => item.S_SERVNO}
            contentContainerStyle={styles.flatListContent}
          />
        ) : (
          <View style={styles.noComplaintsContainer}>
            <MaterialIcons name="inbox" size={64} color="#ccc" />
            <Text style={styles.noComplaintsText}>No complaints found</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  menuButton: {
    padding: 5,
  },
  shareButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  gestureArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 20,
    height: "100%",
    zIndex: 5,
  },
  expandedNav: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: "row",
  },
  overlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  navContainer: {
    width: "70%",
    backgroundColor: "#fff",
    paddingVertical: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    overflow: "hidden",
  },
  stripeContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  stripe: {
    height: 8,
    backgroundColor: "rgba(25, 118, 210, 0.05)",
    width: "100%",
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  navItemPressed: {
    backgroundColor: "#f0f0f0",
  },
  iconContainer: {
    width: 28,
    alignItems: "center",
    marginRight: 10,
  },
  navText: {
    fontSize: 15,
    color: "#333",
  },
  flatListContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#333",
    fontSize: 14,
    minWidth: 80,
  },
  text: {
    fontSize: 14,
    color: "#0066CC",
    flex: 1,
  },
  grayText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  datetime: {
    fontSize: 12,
    color: "#888",
    textAlign: "right",
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noComplaintsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noComplaintsText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
});
