// User's birthdate - Update this with the actual birthdate
export const USER_BIRTHDATE = '1990-01-01'; // Format: YYYY-MM-DD

// Calculate zodiac sign based on birthdate
export const getUserZodiacSign = (birthdate) => {
  const date = new Date(birthdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 1; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 2; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 3; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 4; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 5; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 6; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 7; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 8; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 9; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 10; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 11; // Aquarius
  return 12; // Pisces
};

// Calculate Chinese zodiac sign based on birthdate
export const getUserChineseZodiac = (birthdate) => {
  const date = new Date(birthdate);
  const year = date.getFullYear();
  const zodiacIndex = (year - 4) % 12;
  return zodiacIndex + 1; // Adding 1 to match the API's 1-based indexing
};

// Get user's zodiac sign ID
export const USER_ZODIAC_SIGN_ID = getUserZodiacSign(USER_BIRTHDATE);

// Get user's Chinese zodiac sign ID
export const USER_CHINESE_ZODIAC_ID = getUserChineseZodiac(USER_BIRTHDATE);