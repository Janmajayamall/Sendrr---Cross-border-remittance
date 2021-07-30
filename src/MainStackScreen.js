import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
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

import {MaskedText, mask} from 'react-native-mask-text';

// firebase functions
import {subscribeToNotifications, subscribeToUser} from './FirebaseFunctions';

// utils
import {colorPallette, configFile, getCurrencySign} from './Utils';
import {not} from 'react-native-reanimated';

function HomeScreen({navigation}) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    let subscriber = subscribeToUser(configFile.fromUserId, userData => {
      setUserData(userData);
    });
    return () => subscriber();
  }, []);

  return (
    <NativeBaseProvider>
      <Center style={{backgroundColor: '#0d0d0d', flex: 1}}>
        <VStack space={10} alignItems="center">
          <VStack space={2} alignItems="center">
            <Avatar
              source={{
                uri: userData.avatar,
              }}
              size="2xl">
              SS
            </Avatar>
            <Text fontSize="2xl" color="#ffffff">
              {`Welcome back ${userData.name}!`}
            </Text>
          </VStack>
          <VStack space={2} alignItems="center">
            <Text fontSize="2xl" color="#ffffff">
              Your Balance
            </Text>
            <MaskedText
              type="currency"
              options={{
                prefix: getCurrencySign(userData.currency),
                decimalSeparator: '.',
                groupSeparator: ',',
                precision: 2,
              }}
              style={{
                fontSize: 50,
                color: colorPallette.yellowColor,
              }}>
              {userData.balance * 100}
            </MaskedText>
          </VStack>
          <Button
            // width="80%"
            size="lg"
            onPress={() =>
              navigation.navigate('MyModal', {
                screen: 'Friend',
                params: {userData: userData},
              })
            }
            backgroundColor={colorPallette.secondaryColor}>
            Pay
          </Button>
        </VStack>
      </Center>
    </NativeBaseProvider>
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#ffffff',
    //   }}>
    //   <Text>dhawiudaiu</Text>
    // </View>
  );
}

function HistoryScreen() {
  const [notifications, setNotifications] = useState([]);

  const userData = {userId: configFile.fromUserId};

  useEffect(() => {
    const subscriber = subscribeToNotifications(
      userData.userId,
      notifications => {
        setNotifications(notifications);
      },
    );
    return () => subscriber();
  }, []);

  function NotificationRow(notification) {
    let isUserSender = userData.userId === notification.fromUserId;

    return (
      // <VStack space={0.5} alignItems="flex-start" width="100%">
      <HStack
        key={notification.id}
        style={{margin: 10}}
        space={2}
        width="100%"
        alignItems="center">
        <Avatar
          source={{
            uri: isUserSender ? notification.toAvatar : notification.fromAvatar,
          }}
          size="md">
          SS
        </Avatar>
        <HStack space={1}>
          <Text fontSize="lg" color="#ffffff">
            {`You ${isUserSender ? `sent` : `received`}`}
          </Text>
          <MaskedText
            type="currency"
            options={{
              prefix: getCurrencySign(
                isUserSender
                  ? notification.fromCurrency
                  : notification.toCurrency,
              ),
              decimalSeparator: '.',
              groupSeparator: ',',
              precision: 2,
            }}
            style={{
              fontSize: 18,
              color: isUserSender
                ? colorPallette.redColor
                : colorPallette.blueColor,
              fontWeight: '600',
            }}>
            {Number(
              isUserSender ? notification.fromAmount : notification.toAmount,
            ) * 100}
          </MaskedText>
          <Text fontSize="lg" color="#ffffff">
            {`${
              isUserSender
                ? `to ${notification.toName}`
                : `from ${notification.fromName}`
            }`}
          </Text>
        </HStack>
      </HStack>
      // </VStack>
    );
  }

  return (
    <NativeBaseProvider>
      {/* <Center style={{backgroundColor: '#0d0d0d', flex: 1}}> */}
      <VStack
        style={{backgroundColor: '#0d0d0d', flex: 1}}
        space={1}
        alignItems="center">
        <Text fontSize="lg" style={{marginTop: 50}} color="#ffffff">
          Activity
        </Text>
        <ScrollView
          style={{
            width: '100%',
            // padding: 10,
          }}>
          {notifications.map(notification => {
            return NotificationRow(notification);
          })}
        </ScrollView>
      </VStack>
      {/* </Center> */}
    </NativeBaseProvider>
  );
}

const Tab = createBottomTabNavigator();
export function MainStackScreen() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'ios-person';
          } else if (route.name === 'History') {
            iconName = 'ios-time';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#828282',
        showLabel: false,
        allowFontScaling: true,
        tabStyle: {
          backgroundColor: colorPallette.secondaryColor,
          // borderWidth: 0,
          // shadowColor: 'transparent',
          // paddingBottom: 10,
        },
        style: {backgroundColor: colorPallette.secondaryColor},
      }}
      // barStyle={{backgroundColor: colorPallette.secondaryColor}}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}
