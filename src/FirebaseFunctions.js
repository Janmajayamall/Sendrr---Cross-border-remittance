import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
export function subscribeToUser(userId, callback) {
  const subscriber = firestore()
    .collection('users')
    .doc(userId)
    .onSnapshot(documentSnapshot => {
      if (documentSnapshot) {
        callback({
          ...documentSnapshot._data,
          userId: documentSnapshot._ref._documentPath._parts[1],
        });
      }
    });
  return subscriber;
}

export async function getUserData(userId) {
  const userData = await firestore().collection('users').doc(userId).get();
  return {...userData._data, userId: userData._ref._documentPath._parts[1]};
}

export async function getFriendList(userId) {
  let friends = [];
  const querySnapshot = await firestore().collection('users').get();

  querySnapshot.forEach(documentSnapshot => {
    if (documentSnapshot.id !== userId) {
      friends.push({
        ...documentSnapshot.data(),
        userId: documentSnapshot.id,
      });
    }
  });

  return friends;
}

export async function convertHKDToSGD(hkdValue) {
  const response = await axios({
    headers: {accept: 'application/json'},
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/simple/price',
    params: {
      ids: 'solana',
      vs_currencies: 'sgd,hkd',
    },
  });
  data = response.data;
  const hkdSol = data['solana']['hkd'];
  const sgdSol = data['solana']['sgd'];

  let sendValue = (sgdSol * hkdValue) / hkdSol;
  sendValue = Math.round(sendValue * 100) / 100;
  return sendValue;
}

export async function convertSGDToHKD(sgdValue) {
  const response = await axios({
    headers: {accept: 'application/json'},
    method: 'GET',
    url: 'https://api.coingecko.com/api/v3/simple/price',
    params: {
      ids: 'solana',
      vs_currencies: 'sgd,hkd',
    },
  });
  data = response.data;
  const hkdSol = data['solana']['hkd'];
  const sgdSol = data['solana']['sgd'];

  let sendValue = (hkdSol * sgdValue) / sgdSol;
  sendValue = Math.round(sendValue * 100) / 100;
  return sendValue;
}

export async function sendPayment(
  fromUserId,
  toUserId,
  value,
  fromUserData,
  toUserData,
) {
  let sendValue = 0;
  if (fromUserData.currency === 'HKD') {
    sendValue = await convertHKDToSGD(value);
  } else if (fromUserData.currency === 'SGD') {
    sendValue = await convertSGDToHKD(value);
  }

  // add to receiver's balance
  const increment = firestore.FieldValue.increment(sendValue);
  await firestore().collection('users').doc(toUserId).update({
    balance: increment, // increment age by 1
  });

  // subtract from sender's balance
  const decrement = firestore.FieldValue.increment(-1 * value);
  await firestore().collection('users').doc(fromUserId).update({
    balance: decrement,
  });

  // update notification
  await updateNotifications(
    fromUserId,
    toUserId,
    value,
    sendValue,
    fromUserData.currency,
    toUserData.currency,
    fromUserData.name,
    toUserData.name,
    fromUserData.avatar,
    toUserData.avatar,
  );
}

export async function updateNotifications(
  fromUserId,
  toUserId,
  fromAmount,
  toAmount,
  fromCurrency,
  toCurrency,
  fromName,
  toName,
  fromAvatar,
  toAvatar,
) {
  await firestore()
    .collection('notifications')
    .add({
      fromUserId,
      toUserId,
      fromAmount,
      toAmount,
      fromCurrency,
      toCurrency,
      fromName,
      toName,
      fromAvatar,
      toAvatar,
      userIds: [fromUserId, toUserId],
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
}

export function subscribeToNotifications(userId, callback) {
  const subscriber = firestore()
    .collection('notifications')
    .where('userIds', 'array-contains', userId)
    .onSnapshot(querySnapshot => {
      if (querySnapshot) {
        let notifications = [];
        querySnapshot.forEach(documentSnapshot => {
          notifications.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });
        notifications = notifications.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          } else -1;
        });
        callback(notifications);
      }
    });

  return subscriber;
}
