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
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error("Failed to parse response:", jsonError);
        return;
      }

      if (data?.status === "success" && data?.data) {
        setComplaints(data.data);
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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const isHorizontalSwipe =
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const isSignificantMove = Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe && isSignificantMove;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isExpanded && (gestureState.dx > 50 || gestureState.vx > 0.5)) {
          setIsExpanded(true);
        } else if (
          isExpanded &&
          (gestureState.dx < -50 || gestureState.vx < -0.5)
        ) {
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
      style={[styles.card, { borderLeftWidth: 4, borderLeftColor: '#0066CC' }]}
      onPress={() =>
        navigation.navigate("Engineer/EnggComplaintDetails", {
          complaintNo: String(item.S_SERVNO),
          clientName: String(item.COMP_NAME),
          status: String(item.S_jobstatus),
          dateTime: String(item.S_SERVDT),
          Engineer: String(item.S_assignedengg),
          Assign_Date: String(item.S_assigndate),
          Task_Type: String(item.S_TASK_TYPE),
          Address: String(item.COMP_ADD1),
          Remark: String(item.S_REMARK1),
          SYSTEM_NAME: String(item.SYSTEM_NAME),
          username: String(username),
          password: String(password),
          S_SERVDT: String(item.S_SERVDT),
        })
      }
    >
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <MaterialIcons name="receipt" size={18} color="#0066CC" style={styles.labelIcon} />
          <Text style={styles.label}>Complaint No : </Text>
        </View>
        <Text style={styles.text}>{item.S_SERVNO}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <MaterialIcons name="person" size={18} color="#0066CC" style={styles.labelIcon} />
          <Text style={styles.label}>Client Name : </Text>
        </View>
        <Text style={styles.grayText}>{item.COMP_NAME}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <MaterialIcons name="engineering" size={18} color="#0066CC" style={styles.labelIcon} />
          <Text style={styles.label}>Engineer : </Text>
        </View>
        <Text style={styles.grayText}>{item.S_assignedengg}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <MaterialIcons name="info" size={18} color="#0066CC" style={styles.labelIcon} />
          <Text style={styles.label}>Status : </Text>
        </View>
        <Text style={[
          styles.grayText,
          { 
            color: item.S_jobstatus === 'Completed' ? '#4CAF50' : 
                   item.S_jobstatus === 'Pending' ? '#FFA000' : '#666'
          }
        ]}>{item.S_jobstatus}</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <MaterialIcons name="schedule" size={18} color="#0066CC" style={styles.labelIcon} />
          <Text style={styles.label}>Fault Reported : </Text>
        </View>
        <Text style={styles.grayText}>{item.S_SERVDT}</Text>
      </View>

      
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
        <View style={styles.gestureArea} {...panResponder.panHandlers} />

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

              <View style={styles.navItems}>
                <Pressable
                  style={styles.navItem}
                  onPress={() => handleNavigation("home")}
                >
                  <MaterialIcons name="home" size={24} color="#333" />
                  <Text style={styles.navText}>Home</Text>
                </Pressable>

                <Pressable
                  style={styles.navItem}
                  onPress={() => handleNavigation("Rate")}
                >
                  <MaterialIcons name="star" size={24} color="#333" />
                  <Text style={styles.navText}>Rate Us</Text>
                </Pressable>

                <Pressable
                  style={styles.navItem}
                  onPress={handleAboutUs}
                >
                  <MaterialIcons name="info" size={24} color="#333" />
                  <Text style={styles.navText}>About Us</Text>
                </Pressable>

                <Pressable
                  style={styles.navItem}
                  onPress={handleLogout}
                >
                  <MaterialIcons name="logout" size={24} color="#333" />
                  <Text style={styles.navText}>Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066CC" />
          </View>
        ) : (
          <FlatList
            data={complaints}
            renderItem={renderItem}
            keyExtractor={(item) => item.S_SERVNO}
            contentContainerStyle={styles.listContainer}
          />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  shareButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
  },
  gestureArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 1,
  },
  expandedNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  navContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: "80%",
    maxWidth: 300,
    backgroundColor: "#fff",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoBackground: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f0f0",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  stripeContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  stripe: {
    position: "absolute",
    width: "100%",
    height: "10%",
    backgroundColor: "#0066CC",
    opacity: 0.1,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  navItems: {
    marginTop: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  navText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
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
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 140,
  },
  labelIcon: {
    marginRight: 4,
  },
  label: {
    fontSize: 14,
    color: "#666",
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  grayText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
  },
  datetimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  datetimeIcon: {
    marginRight: 4,
  },
  datetime: {
    fontSize: 12,
    color: "#888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
