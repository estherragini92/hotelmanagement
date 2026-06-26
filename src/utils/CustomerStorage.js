export const getCustomerKey = (key) => {
  const user = JSON.parse(localStorage.getItem("hotelUser"));

  if (!user?.email) {
    return key;
  }

  return `${key}_${user.email}`;
};

export const getCustomerData = (key, fallback = []) => {
  const data = localStorage.getItem(getCustomerKey(key));

  if (!data) {
    return fallback;
  }

  return JSON.parse(data);
};

export const setCustomerData = (key, data) => {
  localStorage.setItem(getCustomerKey(key), JSON.stringify(data));
};