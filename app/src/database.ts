const getExpansionPackMetaMAC = async (mac: string) => {
  const url =
    'https://narratemyway-default-rtdb.europe-west1.firebasedatabase.app/meta-packs.json?orderBy="MAC"&equalTo="' +
    mac +
    '"';
  console.log('Expand beacon found');
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      return json;
    })
    .catch((error) => {
      console.error(error);
    });
};

export default getExpansionPackMetaMAC;
