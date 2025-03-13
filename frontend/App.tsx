import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Screens
import RegisterScreen from './src/screens/RegisterScreen';
import AddProjectScreen from './src/screens/AddProjectScreen';
import SearchProjectsScreen from './src/screens/SearchProjectsScreen';

// Types
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator initialRouteName="Register" screenOptions={{
        headerStyle: {
          backgroundColor: '#4b5d67',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '500',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#f5f9fc',
        }
      }}>
        <Stack.Screen name="Register" component={RegisterScreen} options={{ 
          title: 'Freelancer Hub',
          headerShown: false,
        }} />
        <Stack.Screen name="AddProject" component={AddProjectScreen} options={{ title: 'Add Project' }} />
        <Stack.Screen name="SearchProjects" component={SearchProjectsScreen} options={{ title: 'Search Projects' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 