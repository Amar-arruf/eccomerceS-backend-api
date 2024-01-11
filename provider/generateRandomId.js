function generateRandomId(length) {
  let id = "";
  const characters = "123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    id += characters.charAt(randomIndex);
  }

  return id;
}

module.exports = generateRandomId;
