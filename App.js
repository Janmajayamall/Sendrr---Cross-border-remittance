/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Avatar,
  VStack,
  NativeBaseProvider,
  Center,
  Button,
  Text,
  List,
  ScrollView,
  HStack,
  Divider,
  KeyboardAvoidingView,
} from 'native-base';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {width} from 'styled-system';
import {TouchableOpacity} from 'react-native';

import {MaskedTextInput} from 'react-native-mask-text';

import {MainStackScreen} from './src/MainStackScreen';
import {ModalScreen} from './src/ModalScreen';
import {colorPallette} from './src/Utils';

const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer screenOptions={{}}>
      <RootStack.Navigator
        mode="modal"
        screenOptions={() => ({
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        })}
        headerMode="none">
        <RootStack.Screen
          name="Home"
          component={MainStackScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen name="MyModal" component={ModalScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
