import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Screen Imports
import PanelNew1 from './components/panel.jsx';
import CustomerLoginNew from './components/Customerlogin.jsx';
import WorkerLogin from './components/workerlogin.jsx';
import WorkerDashboard from './components/workerdashboard.jsx';
import SocietyDashboard from './components/societydashboard.jsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Panel');
  const [sessionUser, setSessionUser] = useState(null);

  // Unified navigation prop passed down to all screens
  const navigation = {
    navigate: (screenName) => setCurrentScreen(screenName),
    goBack: () => setCurrentScreen('Panel'),
  };

  const handleLogout = () => {
    setSessionUser(null);
    setCurrentScreen('Panel');
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Panel':
        return (
          <PanelNew1
            navigation={navigation}
            onNavigate={(route) => setCurrentScreen(route)}
            onRoleSelect={(roleKey, route) => setCurrentScreen(route)}
            showSplash={false}
          />
        );

      case 'CustomerLogin':
        return (
          <CustomerLoginNew
            navigation={navigation}
            onBack={() => setCurrentScreen('Panel')}
            onNavigate={(route) => setCurrentScreen(route)}
            onLoginSuccess={(userData) => {
              setSessionUser(userData);
              setCurrentScreen('CustomerDashboard');
            }}
          />
        );

      case 'CustomerDashboard':
        // If customer dashboard component isn't added yet, return Panel or placeholder
        return (
          <PanelNew1
            navigation={navigation}
            onNavigate={(route) => setCurrentScreen(route)}
            showSplash={false}
          />
        );

      case 'WorkerLogin':
        return (
          <WorkerLogin
            navigation={navigation}
            onBack={() => setCurrentScreen('Panel')}
            onLogin={(userData) => {
              setSessionUser(userData);
              setCurrentScreen('WorkerDashboard');
            }}
          />
        );

      case 'WorkerDashboard':
        return (
          <WorkerDashboard
            navigation={navigation}
            userName={sessionUser?.identifier || 'Ravi'}
            initials="RK"
            onLogout={handleLogout}
            onNavigate={(key) => {
              if (key === 'profile') setCurrentScreen('Panel');
            }}
          />
        );

      case 'SocietyLogin':
      case 'SocietyDashboard':
        return (
          <SocietyDashboard
            navigation={navigation}
            adminName="Dr. S. K. Awasthi"
            onLogout={handleLogout}
          />
        );

      case 'FederationLogin':
      case 'FederationDashboard':
        return (
          <SocietyDashboard
            navigation={navigation}
            societyName="Apex Labour Cooperative Federation"
            adminName="Federation Director"
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <PanelNew1
            navigation={navigation}
            onNavigate={(route) => setCurrentScreen(route)}
            showSplash={false}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {renderActiveScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3ECE0',
  },
});