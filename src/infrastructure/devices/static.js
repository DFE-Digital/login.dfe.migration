const syncDigipassToken = async (serialNumber, code1, code2) => {
  if (code1 + 1 === code2) {
    return true;
  }
  return false;
};

module.exports = {
  syncDigipassToken,
};
