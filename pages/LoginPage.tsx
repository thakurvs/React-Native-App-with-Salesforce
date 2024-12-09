import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import { oauth } from 'react-native-force';
import { useNavigation } from '@react-navigation/native';
import { storeTokens } from '../authUtils';

type NavigationProps = {
  navigate: (screen: string) => void;
};

const LoginPage: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const handleLogin = () => {
    oauth.authenticate(
      (response: { accessToken: string; instanceUrl: string; refreshToken: string }) => {
        console.log('Authenticated successfully!', response);
        storeTokens(response); // Save tokens securely
        navigation.navigate('Home'); // Navigate to HomePage
      },
      (error: any) => {
        console.error('Authentication failed:', error);
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Salesforce</Text>
      <Button title="Login with Salesforce" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LoginPage;
