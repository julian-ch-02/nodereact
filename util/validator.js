exports.validateRegister = (username, password, confirmPassword) => {
  const errors = {};
  if (username.trim() === 0) {
    errors.username = "Username musn't empty";
  }
  if (password.trim() === 0) {
    errors.password = "password musn't empty";
  }
  if (confirmPassword.trim() === 0) {
    errors.confirmPassword = "Confirmation Password musn't empty";
  }
  if (password !== confirmPassword) {
    errors.password = "Confirmation Password and Password not match";
    errors.confirmPassword = "Confirmation Password and Password not match";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

exports.validateLogin = (username,password) => {
  const errors = {};
  if(username.trim() === 0){
    errors.username = "Username musn't empty";
  }
  if(password.trim() === 0){
    errors.password = "Password musn't empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
}
