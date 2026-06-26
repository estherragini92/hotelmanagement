import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const defaultUsers = [
  {
    id: 1,
    name: "Hotel Admin",
    email: "admin@hotel.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    name: "Muthu Vel",
    email: "customer@hotel.com",
    password: "customer123",
    role: "customer",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("hotelUser"));
    const savedUsers = JSON.parse(localStorage.getItem("hotelUsers"));

    if (!savedUsers) {
      localStorage.setItem("hotelUsers", JSON.stringify(defaultUsers));
    }

    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const getUsers = () => {
    return JSON.parse(localStorage.getItem("hotelUsers")) || defaultUsers;
  };

  const login = (email, password) => {
    const users = getUsers();

    const foundUser = users.find(
      (item) => item.email === email && item.password === password
    );

    if (!foundUser) {
      return null;
    }

    setUser(foundUser);
    localStorage.setItem("hotelUser", JSON.stringify(foundUser));
    return foundUser;
  };

  const register = (name, email, password) => {
    const users = getUsers();

    const alreadyExists = users.find((item) => item.email === email);

    if (alreadyExists) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: "customer",
    };

    const updatedUsers = [...users, newUser];

    localStorage.setItem("hotelUsers", JSON.stringify(updatedUsers));

    return {
      success: true,
      user: newUser,
    };
  };

  const googleLogin = () => {
    const googleUser = {
      id: Date.now(),
      name: "Google Customer",
      email: "googleuser@gmail.com",
      password: "",
      role: "customer",
    };

    const users = getUsers();

    const existingUser = users.find((item) => item.email === googleUser.email);

    if (!existingUser) {
      localStorage.setItem("hotelUsers", JSON.stringify([...users, googleUser]));
    }

    const finalUser = existingUser || googleUser;

    setUser(finalUser);
    localStorage.setItem("hotelUser", JSON.stringify(finalUser));

    return finalUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hotelUser");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}