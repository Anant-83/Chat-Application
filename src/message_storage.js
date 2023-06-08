const messages = [];

function savemessage(message) {
  messages.push(message);
}
function findmessageforuser(userId) {
  return messages.filter(({ from, to }) => from === userId || to === userId);
}
module.exports = { savemessage, findmessageforuser, messages };
