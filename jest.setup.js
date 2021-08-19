import React from 'react';
import { NativeModules } from 'react-native';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

// Mock the RNCNetInfo native module to allow us to unit test the JavaScript code
NativeModules.RNCNetInfo = {
  getCurrentState: jest.fn(),
  addListener: jest.fn(),
  removeListeners: jest.fn(),
};

jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native-dropdown-picker', () => () => (<div>Mock</div>));
jest.mock('expo-location', () => () => (<div>Mock</div>));
jest.mock('expo-notifications', () => ({ setNotificationHandler: jest.fn(() => 'mock') }));