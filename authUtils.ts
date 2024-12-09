import EncryptedStorage from 'react-native-encrypted-storage';
import { oauth } from 'react-native-force'; // Ensure this import is added

// Store tokens securely
export const storeTokens = async (tokens: {accessToken: string; instanceUrl: string; refreshToken: string}) => {
  try {
    await EncryptedStorage.setItem('authTokens', JSON.stringify(tokens));
    console.log('Tokens stored securely');
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
};

// Retrieve stored tokens
export const getTokens = async () => {
  try {
    const tokenData = await EncryptedStorage.getItem('authTokens');
    if (tokenData) {
      const tokens = JSON.parse(tokenData);
      console.log('Retrieved tokens:', tokens);
      return tokens;
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    return null;
  }
};

// Refresh the access token using Salesforce's OAuth token endpoint
export const refreshAuthToken = async (
    refreshToken: string,
    consumerKey: string,
    redirectUri: string
  ) => {
    try {
      const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: consumerKey,
          refresh_token: refreshToken,
          redirect_uri: redirectUri,
        }).toString(),
      });
  
      if (response.ok) {
        const newCredentials = await response.json();
        console.log('Token refreshed:', newCredentials.access_token);
  
        // Store the refreshed tokens
        await storeTokens({
          accessToken: newCredentials.access_token,
          instanceUrl: newCredentials.instance_url,
          refreshToken: refreshToken, // The refresh token remains the same
        });
  
        return newCredentials;
      } else {
        console.error('Failed to refresh token:', await response.text());
        return null;
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      return null;
    }
  };