import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user state from 'currentUser' in localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Update localStorage 'currentUser' whenever the user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser"); // Remove if user becomes null (e.g., on logout)
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);












// // src/context/AuthContext.jsx
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const name = localStorage.getItem("name");
//     const role = localStorage.getItem("role");
//     return name && role ? { name, role } : null;
//   });

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("name", user.name);
//       localStorage.setItem("role", user.role);
//     }
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);



















// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const savedUser = localStorage.getItem("currentUser");
//       if (savedUser) setUser(JSON.parse(savedUser));
//     } catch (err) {
//       console.error("Failed to load user from localStorage", err);
//     }
//   }, []);

//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("currentUser", JSON.stringify(user));
//     }
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   // ➊ Read saved user (if any) on first load
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("user");
//     return stored ? JSON.parse(stored) : null;
//   });

//   // ➋ Whenever user changes, keep localStorage in sync
//   useEffect(() => {
//     if (user) localStorage.setItem("user", JSON.stringify(user));
//     else localStorage.removeItem("user");
//   }, [user]);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
