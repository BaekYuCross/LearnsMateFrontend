let currentTimer = null;
let timerCallback = null;

export const startTimer = (expirationTime, callback) => {
  if (!expirationTime || isNaN(expirationTime.getTime())) {
    console.error('Invalid expirationTime passed to startTimer:', expirationTime);
    callback('만료됨');
    return;
  }

  if (currentTimer) {
    clearInterval(currentTimer);
  }

  timerCallback = callback;

  currentTimer = setInterval(() => {
    const remaining = calculateRemainingTime(expirationTime);
    if (remaining === '만료됨') {
      clearInterval(currentTimer);
    }
    callback(remaining);
  }, 1000);

  callback(calculateRemainingTime(expirationTime));

  return currentTimer;
};

export const resetTimer = (newExpirationTime) => {
  if (timerCallback) {
    startTimer(newExpirationTime, timerCallback);
  }
};
  
export const calculateRemainingTime = (expirationDate) => {
  if (!expirationDate || isNaN(expirationDate.getTime())) {
    return '만료됨';
  }

  const now = new Date();
  const localExpiration = new Date(expirationDate);
  const diff = localExpiration - now;

  if (diff <= 0) return '만료됨';

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};