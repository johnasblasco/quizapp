import React, { createContext, useContext, useState } from "react";

const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
      const [isHovered, setIsHovered] = useState(false);

      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);

      return (
            <CursorContext.Provider
                  value={{
                        isHovered,
                        handleMouseEnter,
                        handleMouseLeave,
                  }}
            >
                  {children}
            </CursorContext.Provider>
      );
};

export const useCursor = () => useContext(CursorContext);
