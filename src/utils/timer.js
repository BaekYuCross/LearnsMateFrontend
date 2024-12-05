export const startTimer = (expirationTime, callback) => {
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(expirationTime);
      if (remaining === '만료됨') {
        clearInterval(timer);
        callback();
      }
      callback(remaining);
    }, 1000);
  
    return timer;
  };
  
  export const calculateRemainingTime = (expirationDate) => {
    const now = new Date();
    const diff = expirationDate - now;
  
    if (diff <= 0) return '만료됨';
  
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
  
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  