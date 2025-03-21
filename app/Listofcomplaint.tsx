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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState, useRef } from "react";
import { Ionicons, MaterialIcons, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: { role?: string };
  SignUpScreen: undefined;
  Rate: undefined;
  index: undefined;
  ComplaintDetails: { 
    complaintNo: string;
    clientName: string;
    status: string;
    dateTime: string;
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const dummyData = [
  {
    id: "1",
    complaintNo: "C-202503130110851",
    clientName: "Testing demo for cloud",
    status: "Assigned",
    dateTime: "2025-03-13 13:08:51",
  },
  {
    id: "2",
    complaintNo: "C-202503130110925",
    clientName: "Testing demo for cloud",
    status: "Assigned",
    dateTime: "2025-03-13 13:09:25",
  }
];

const ComplaineWithNavBar = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isExpanded, setIsExpanded] = useState(false);
  const insets = useSafeAreaInsets();

  // PanResponder for swipe detection
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal gestures that are significant enough
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy * 2);
        const isSignificantMove = Math.abs(gestureState.dx) > 10;
        return isHorizontalSwipe && isSignificantMove;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!isExpanded && (gestureState.dx > 50 || gestureState.vx > 0.5)) {
          // Swipe right when closed -> open
          setIsExpanded(true);
        } else if (isExpanded && (gestureState.dx < -50 || gestureState.vx < -0.5)) {
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
          navigation.navigate("LoginScreen", { role: "user" });
        }
      },
    ]);
  };

  const handleAboutUs = async () => {
    try {
      const url = 'https://www.google.com';
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert("Error", "Cannot open the URL");
    }
  };

  const handleNavigation = (route: 'home' | 'Rate') => {
    setIsExpanded(false);
    if (route === 'Rate') {
      navigation.navigate("Rate");
    } else if (route === 'home') {
      navigation.navigate("index");
    }
  };

  const renderItem = ({ item }: { item: typeof dummyData[0] }) => (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate('ComplaintDetails', {
        complaintNo: item.complaintNo,
        clientName: item.clientName,
        status: item.status,
        dateTime: item.dateTime
      })}
    >
      <View style={styles.row}>
        <Text style={styles.label}>Complaint Number : </Text>
        <Text style={styles.text}>{item.complaintNo}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Client Name : </Text>
        <Text style={styles.grayText}>{item.clientName}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Status : </Text>
        <Text style={styles.grayText}>{item.status}</Text>
      </View>

      <Text style={styles.datetime}>{item.dateTime}</Text>
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
          <Ionicons name={isExpanded ? "close" : "menu"} size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>Complaints</Text>
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
        <View 
          style={styles.gestureArea} 
          {...panResponder.panHandlers} 
        />

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
                    {Array(10).fill(0).map((_, index) => (
                      <View key={index} style={styles.stripe} />
                    ))}
                  </View>
                  <Image
                    source={require('../assets/images/magnum_logo.png')}
                    style={styles.logoImage}
                  />
                </View>
              </View>

              <Text style={styles.username}>{"Niraj Kumar Yadav"}</Text>

              <Pressable
                style={({pressed}) => [
                  styles.navItem,
                  pressed && styles.navItemPressed
                ]}
                onPress={() => handleNavigation('home')}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="home-filled" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>Home</Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.navItem,
                  pressed && styles.navItemPressed
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
                style={({pressed}) => [
                  styles.navItem,
                  pressed && styles.navItemPressed
                ]}
                onPress={() => handleNavigation('Rate')}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="star-border" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>Rate Us</Text>
              </Pressable>

              <Pressable
                style={({pressed}) => [
                  styles.navItem,
                  pressed && styles.navItemPressed
                ]}
                onPress={handleLogout}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="logout" size={22} color="#666" />
                </View>
                <Text style={styles.navText}>Log Out</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Complaint List */}
        <FlatList
          data={dummyData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 1500,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  shareButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  text: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  grayText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  datetime: {
    textAlign: "right",
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  menuButton: {
    padding: 8,
    zIndex: 2000,
  },
  expandedNav: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 1000,
    elevation: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  navContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: "#ffffff",
    padding: 0,
    paddingTop: 20,
    height: "100%",
    width: "80%",
    elevation: 1001,
    zIndex: 1001,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoContainer: {
    marginBottom: 20,
    width: '100%',
  },
  logoBackground: {
    backgroundColor: '#fff',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stripeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  stripe: {
    flex: 1,
    backgroundColor: '#e8f4ff',
    marginHorizontal: 5,
  },
  logoImage: {
    width: 180,
    height: 50,
    resizeMode: 'contain',
    zIndex: 1,
  },
  username: {
    fontSize: 18,
    color: '#000',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  navItemPressed: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  navText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  gestureArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20, // Small area on the left edge for gestures
    height: '100%',
    zIndex: 100,
  },
});

export default ComplaineWithNavBar;
