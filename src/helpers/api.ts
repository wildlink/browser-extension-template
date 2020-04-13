const getDomainBlacklist = async (): Promise<string[]> => {
  const response = await fetch(
    'https://storage.googleapis.com/wildlink/web/chrome/blacklist.json',
    {
      method: 'GET',
    },
  );
  if (response.ok) {
    const blacklist = await response.json();
    return blacklist;
  }
  return [];
};

export default {
  getDomainBlacklist,
};
