let currentTimer = null;
let timerCallback = null;

export const startTimer = (expirationTime, callback) => {
  clearTimer(); // Clear existing timer first
  
  if (!expirationTime || isNaN(expirationTime.getTime())) {
    console.error('Invalid expirationTime:', expirationTime);
    callback('만료됨');
    return;
  }

  timerCallback = callback;
  currentTimer = setInterval(() => {
    const remaining = calculateRemainingTime(expirationTime);
    if (remaining === '만료됨') {
      clearTimer();
    }
    callback(remaining);
  }, 1000);
};

export const clearTimer = () => {
  if (currentTimer) {
    clearInterval(currentTimer);
    currentTimer = null;
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