export const validateForm = (data) => {
  const errors = {};

  // Username validation
  if (!data.username.trim()) {
    errors.username = 'Username is required';
  } else if (!/^[a-zA-Z0-9_.]{3,20}$/.test(data.username)) {
    errors.username = 'Username must be between 3 and 20 characters and can only contain letters, numbers, underscores, or periods';
  }

  // Password validation
  if (!data.password.trim()) {
    errors.password = 'Password is required';
  } else if (!/^[a-zA-Z0-9_@]{8,16}$/.test(data.password)) {
    errors.password = 'Password must be between 8 and 16 lengths and can only contain letters, numbers, underscores, @';
  }

  // Full Name validation
  if (!data.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (!/^[\w\s]{2,50}$/.test(data.fullName)) {
    errors.fullName = 'Full Name must be between 2 and 50 characters and can only contain letters and spaces';
  }

    // Bio validation
  if (!data.bio.trim()) {
    errors.bio = 'Bio is required';
  } else if (!/^[\w\s'-_.]{5,60}$/.test(data.bio)) {
    errors.bio = 'Bio must be between 5 and 60 characters and can only contain letters, spaces, hyphens, underscore, period or apostrophes';
  }

  return errors;
};