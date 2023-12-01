const clearCookie = (res) => {
  res.cookie("token", null, {
    maxAge: 0,
    httpOnly: true,
    secure: false,
  });
};

export default clearCookie;
