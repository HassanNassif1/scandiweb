import React, { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [activeCategoryId, setActiveCategoryId] = useState(1); // Default category ID

  return (
    <CategoryContext.Provider value={{ activeCategoryId, setActiveCategoryId }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => useContext(CategoryContext);
