export function getCurrencySign(currency) {
  if (currency === 'HKD') {
    return 'HK$';
  } else if (currency === 'SGD') {
    return 'SG$';
  } else if (currency === 'INR') {
    return 'Rs';
  } else if (currency === 'USD') {
    return 'US$';
  } else {
    return '$';
  }
}

export const configFile = {
  fromUserId: '2',
};

export const colorPallette = {
  primaryColor: '#0d0d0d',
  secondaryColor: '#19202D',
  yellowColor: '#D4F15F',
  purpleColor: '#5F62F2',
  redColor: '#E76565',
  blueColor: '#67B5B7',
};
