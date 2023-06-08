const genratemessage = (data) => {
  return {
    id: data.id,
    name: data.name,
    message: data.message || null,
    files: data.files || null,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  genratemessage,
};
