import { useEffect, useState } from "react";
import { useUserServices } from "../../services/user.services";



export const UserHook = () => {
  const { getUsers, updateUser: updateUserService } = useUserServices();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({ includeAdmins: false });
      if (response) {
        setUsers(response);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (user: User) => {
    // Implement create functionality when available in the API
    console.log("Create user:", user);
  };

  const updateUser = async (user: User) => {
    try {
      const response = await updateUserService({ userDetails: user });
      if (response) {
        setUsers(users.map(u => u.id === user.id ? response : u));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error updating user");
    }
  };

  const deleteUser = async (id: number) => {
    // Implement delete functionality when available in the API
    console.log("Delete user with id:", id);
  };

  return {
    loading,
    error,
    users,
    createUser,
    updateUser,
    deleteUser,
  };
};

