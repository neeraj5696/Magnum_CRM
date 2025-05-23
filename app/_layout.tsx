import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='Onboarding' options={{headerShown: false}} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name = "LoginScreen"  options={{ headerShown: false }} />
        <Stack.Screen name = "EnggLoginScreen"  options={{ headerShown: false }} />
        <Stack.Screen name= "ChangePassword" options={{ headerShown: false }} />
        <Stack.Screen name="Managerpage" options={{ headerShown: false }} />
        <Stack.Screen name="Listofcomplaint" options={{headerShown: false, headerLeft: () => null}} />
        <Stack.Screen name="EnggListofcomplaint" options={{headerShown: false, headerLeft: () => null}} />
        <Stack.Screen name="ComplaintDetails" options={{ headerShown: false }} />
        <Stack.Screen name="EnggComplaintDetails" options={{ headerShown: false }} />
        <Stack.Screen name = "Rate"  options={{ headerShown: false }} /> 
        <Stack.Screen name = "CheckInOut"  options={{ headerShown: false }} /> 
        <Stack.Screen name = "Check"  options={{ headerShown: false}} />
        
        {/* Engineer routes */}
        <Stack.Screen name = "Engineer/EnggLoginScreen" options={{ headerShown: false }} />
        <Stack.Screen name = "Engineer/EnggListofcomplaint" options={{headerShown: false, headerLeft: () => null}} />
        <Stack.Screen name = "Engineer/EnggComplaintDetails" options={{ headerShown: false }} />
        
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
