const partition: any = (array: [], callback: any) => {
  const matches: [] = [];
  const nonMatches: [] = [];
  array.forEach((element) =>
    (callback(element) ? matches : nonMatches).push(element)
  );

  return [matches, nonMatches];
};

export { partition };
