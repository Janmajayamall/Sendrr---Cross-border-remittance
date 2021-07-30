import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
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
  Spinner,
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

// firebase functions
import {getFriendList, getUserData, sendPayment} from './FirebaseFunctions';
import {colorPallette, getCurrencySign} from './Utils';

function FriendScreen({route, navigation}) {
  const {userData} = route.params;

  const [friends, setFriends] = useState([]);

  useEffect(async () => {
    const friends = await getFriendList(userData.userId);
    setFriends(friends);
  }, []);

  function FriendRow(friend) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EnterAmount', {
            userData: userData,
            receiverUserData: friend,
          })
        }
        key={friend.userId}>
        <VStack space={0.5} alignItems="center">
          <HStack space={3} alignItems="center" style={{margin: 10}}>
            <Avatar
              source={{
                uri: friend.avatar,
              }}
              size="md">
              SS
            </Avatar>
            <VStack alignItems="flex-start" space={2} style={{width: '80%'}}>
              <Text fontSize="xl" color="#ffffff">
                {friend.name}
              </Text>
            </VStack>
          </HStack>
          <Divider width="95%" size={0.5} bgColor={'grey'} />
        </VStack>
      </TouchableOpacity>
    );
  }

  return (
    <NativeBaseProvider>
      <VStack
        style={{backgroundColor: '#0d0d0d', flex: 1}}
        space={2}
        alignItems="center">
        {/* <Text fontSize="5xl" color="#ffffff">
          Your Balance
        </Text> */}
        <ScrollView
          style={{
            width: '100%',
            padding: 10,
          }}>
          {friends.map(val => {
            return FriendRow(val);
          })}
        </ScrollView>
      </VStack>
    </NativeBaseProvider>
  );
}

function EnterAmountScreen({route, navigation}) {
  const {userData, receiverUserData} = route.params;
  const [amountObj, setAmountObj] = useState({
    rawAmount: 0,
    amount: 0.0,
  });
  //   const [receiverUserData, setReceiverUserData] = useState({name: ''});

  //   useEffect(async () => {
  //     const userData = await getUserData(configFile.toUserId);
  //     setReceiverUserData(userData);
  //   }, []);

  return (
    <NativeBaseProvider>
      <HStack style={{backgroundColor: '#0d0d0d', flex: 1}} alignItems="center">
        <KeyboardAvoidingView
          style={{width: '100%'}}
          behavior="padding"
          keyboardVerticalOffset={250}>
          <VStack space={5} style={{width: '100%'}} alignItems="center">
            <VStack space={1} alignItems="center">
              <Avatar
                source={{
                  uri: receiverUserData.avatar,
                }}
                size="2xl">
                SS
              </Avatar>
              <Text fontSize="2xl" color="#ffffff">
                {receiverUserData.name}
              </Text>
              <MaskedTextInput
                type="currency"
                options={{
                  prefix: getCurrencySign(userData.currency),
                  decimalSeparator: '.',
                  groupSeparator: ',',
                  precision: 2,
                }}
                onChangeText={(text, rawText) => {
                  setAmountObj({
                    rawAmount: Number(rawText) / 100,
                    amount: text,
                  });
                }}
                value={amountObj.amount}
                style={{
                  margin: 12,
                  fontSize: 50,
                  color: colorPallette.yellowColor,
                }}
                keyboardType="numeric"
              />
            </VStack>

            <Button
              width="80%"
              size="lg"
              onPress={() =>
                navigation.navigate('ConfirmAmount', {
                  amountObj: amountObj,
                  userData: userData,
                  receiverUserData: receiverUserData,
                })
              }
              backgroundColor={colorPallette.secondaryColor}>
              Next
            </Button>
          </VStack>
        </KeyboardAvoidingView>
      </HStack>
    </NativeBaseProvider>
  );
}

function ConfirmAmountScreen({route, navigation}) {
  const {amountObj, userData, receiverUserData} = route.params;
  return (
    <NativeBaseProvider>
      <HStack style={{backgroundColor: '#0d0d0d', flex: 1}} alignItems="center">
        <KeyboardAvoidingView
          style={{width: '100%'}}
          behavior="position"
          keyboardVerticalOffset={70}>
          <VStack space={5} style={{width: '100%'}} alignItems="center">
            <VStack space={1} alignItems="center">
              <Avatar
                source={{
                  uri: receiverUserData.avatar,
                }}
                size="2xl">
                SS
              </Avatar>
              <Text fontSize="xl" color="#ffffff">
                {receiverUserData.name}
              </Text>
              <Text
                style={{
                  margin: 12,
                  fontSize: 50,
                  color: colorPallette.yellowColor,
                }}
                keyboardType="numeric">
                {amountObj.amount}
              </Text>
            </VStack>

            <Button
              width="80%"
              size="lg"
              onPress={() => {
                sendPayment(
                  userData.userId,
                  receiverUserData.userId,
                  amountObj.rawAmount,
                  userData,
                  receiverUserData,
                );

                navigation.navigate('DonePayment', {
                  amountObj: amountObj,
                  userData: userData,
                  receiverUserData: receiverUserData,
                });
              }}
              backgroundColor={colorPallette.secondaryColor}>
              Confirm
            </Button>
          </VStack>
        </KeyboardAvoidingView>
      </HStack>
    </NativeBaseProvider>
  );
}

function DonePaymentScreen({route, navigation}) {
  const {amountObj, userData, receiverUserData} = route.params;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        navigation.navigate('Home');
      }, 3000);
    }
  }, [loading]);

  if (loading) {
    return (
      <NativeBaseProvider>
        <Center style={{backgroundColor: '#0d0d0d'}} flex={1}>
          <HStack space={2}>
            {/* <Text
              fontSize="2xl"
              style={{color: '#ffffff'}}
              keyboardType="numeric">
              Processing
            </Text> */}
            <Spinner
              color={colorPallette.yellowColor}
              accessibilityLabel="Loading posts"
            />
          </HStack>
        </Center>
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider>
      <HStack style={{backgroundColor: '#0d0d0d', flex: 1}} alignItems="center">
        <VStack space={2} style={{width: '100%'}} alignItems="center">
          <VStack space={1} alignItems="center">
            <Avatar
              source={{
                uri: receiverUserData.avatar,
              }}
              size="xl">
              SS
            </Avatar>

            <Text
              fontSize="2xl"
              style={{color: '#ffffff'}}
              keyboardType="numeric">
              {`You paid ${amountObj.amount} to ${receiverUserData.name}`}
            </Text>
          </VStack>
          <Ionicons
            name={'ios-checkmark-circle-outline'}
            size={100}
            color={colorPallette.yellowColor}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </VStack>
      </HStack>
    </NativeBaseProvider>
  );
}

const ModalStack = createStackNavigator();
export function ModalScreen({navigation}) {
  return (
    <ModalStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colorPallette.secondaryColor,
          borderBottomWidth: 0,
          shadowColor: 'transparent',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: 20,
        },
        headerBackImage: ({navigation}) => (
          <Ionicons
            name={'ios-chevron-back'}
            size={25}
            color={'#ffffff'}
            onPress={() => {
              navigation.goBack();
            }}
          />
        ),
        headerBackTitle: ' ',
      }}>
      <ModalStack.Screen
        name="Friend"
        component={FriendScreen}
        options={{headerShown: true, title: 'People', headerLeft: () => {}}}
      />
      <ModalStack.Screen
        name="EnterAmount"
        component={EnterAmountScreen}
        options={{headerShown: true, title: 'Amount'}}
      />
      <ModalStack.Screen
        name="ConfirmAmount"
        component={ConfirmAmountScreen}
        options={{headerShown: true, title: 'Confirm'}}
      />
      <ModalStack.Screen
        name="DonePayment"
        component={DonePaymentScreen}
        options={{
          headerShown: true,
          title: 'Payment Done',
          headerLeft: () => {},
        }}
      />
    </ModalStack.Navigator>
  );
}
