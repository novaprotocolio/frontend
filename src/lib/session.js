/**
 * Login Data
 * {
 *   address: "0x....",
 *   novaAuthentication: "xxx.bbb.ccc"
 * }
 */

export const saveLoginData = (address, novaAuthentication) => {
  window.localStorage.setItem(`loginData-${address}`, JSON.stringify({ address, novaAuthentication }));
};

export const cleanLoginDate = address => {
  window.localStorage.removeItem(`loginData-${address}`);
};

export const loadAccountNovaAuthentication = address => {
  const savedData = window.localStorage.getItem(`loginData-${address}`);

  if (!savedData) {
    return null;
  }

  let loginData;
  try {
    loginData = JSON.parse(savedData);
  } catch (e) {
    cleanLoginDate(address);
    return null;
  }

  if (loginData.address && loginData.address.toLowerCase() === address.toLowerCase()) {
    return loginData.novaAuthentication;
  }

  return null;
};
