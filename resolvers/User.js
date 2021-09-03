const profile = async (_, args) => {
  return await "Hello";
};

module.exports = {
  Query: {
    profile,
  },
};
