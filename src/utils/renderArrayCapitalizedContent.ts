export const renderArrayCapitalizedContent = (input: string[]) => {
  const capitalizedContent = input
    .map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase())
    .join(", ");

  return capitalizedContent;
};
