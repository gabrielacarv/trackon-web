// import React, { createContext, useState, useEffect } from 'react';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [customer, setCustomer] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (storedUser) {
//       setUser(storedUser);
//       fetchCustomer(storedUser);
//     }
//     setLoading(false);
//   }, []);

//       const fetchCustomer = async (user) => {
//         try {
//           const response = await fetch(`https://trackon.app.br/api/Cliente/email/${encodeURIComponent(user.email)}`, {
//           method: 'GET',
//           headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`,
//         }
//       });

//       if (response.ok) {
//         const customerData = await response.json();
//         setCustomer(customerData);
//       } else {
//         setCustomer(null);
//       }
//     } catch (error) {
//       setCustomer(null);
//     }
//   };

//   const login = (user) => {
//     localStorage.setItem('user', JSON.stringify(user));
//     setUser(user);
//     fetchCustomer(user);
//   };

//   const logout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     setCustomer(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, customer, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthProvider, AuthContext };

import React, { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);


  const fetchCustomer = async (userData) => {
    try {
      const response = await fetch(
        `https://trackon.app.br/api/Cliente/email/${encodeURIComponent(
          userData.email
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );

      if (!response.ok) return null;

      const customerData = await response.json();

      const mergedUser = {
        ...userData,
        id: customerData.id,
        nome: customerData.nome,
        email: customerData.email,
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));

      setUser(mergedUser);
      return mergedUser;
    } catch (err) {
      return null;
    }
  };


  useEffect(() => {
    const stored = localStorage.getItem("user");

    if (!stored) {
      setLoading(false);
      return;
    }

    const storedUser = JSON.parse(stored);

    fetchCustomer(storedUser).finally(() => setLoading(false));
  }, []);


  const login = async (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return await fetchCustomer(userData);
  };


  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
