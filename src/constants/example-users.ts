interface User {
  id: string;
  email: string;
  fullname: string;
  user_type: "superadmin" | "admin" | "user";
  avatar: string;
  is_operator?: boolean;
}

export const exampleUsers: User[] = [
  {
    id: "superadmin_1",
    email: "superadmin@example.com",
    fullname: "Superadmin User",
    user_type: "superadmin",
    avatar: "https://i.pravatar.cc/300?img=1",
  },
  {
    id: "admin_1",
    email: "admin@example.com",
    fullname: "Admin User",
    user_type: "admin",
    avatar: "https://i.pravatar.cc/300?img=2",
  },
  {
    id: "user_operator_1",
    email: "operator@example.com",
    fullname: "Operator User",
    user_type: "user",
    avatar: "https://i.pravatar.cc/300?img=4",
    is_operator: true,
  },
  {
    id: "user_1",
    email: "user@example.com",
    fullname: "Regular User",
    user_type: "user",
    avatar: "https://i.pravatar.cc/300?img=3",
  },
];

// Helper function to get a user by role
export const getUserByRole = (role: User["user_type"], isOperator?: boolean): User | undefined => {
  if (role === "user" && isOperator !== undefined) {
    return exampleUsers.find((user: User) => user.user_type === role && user.is_operator === isOperator);
  }
  return exampleUsers.find((user: User) => user.user_type === role);
};

// Helper function to get mock credentials for a user
export const getMockCredentials = (user: User) => {
  return {
    email: user.email,
    password: "password123", // Example password, in real app would be hashed
  };
};
