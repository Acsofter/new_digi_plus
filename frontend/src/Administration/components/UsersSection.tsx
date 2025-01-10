"use client"

import React, { useState } from 'react';
import { UserHook } from '../hooks/UserHook';

export const UsersSection = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = UserHook();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({});

  const handleCreateUser = () => {
    createUser(newUser as User);
    setNewUser({});
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      updateUser(editingUser);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: number) => {
    deleteUser(id);
  };

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>
      
      {/* Create User Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Crear Nuevo Usuario</h3>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded mb-2"
          value={newUser.first_name || ''}
          onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={newUser.email || ''}
          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
        />
        <button
          onClick={handleCreateUser}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear Usuario
        </button>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium mb-2">Editar Usuario</h3>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.first_name}
              onChange={(e) => setEditingUser({...editingUser, first_name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded mb-2"
              value={editingUser.email}
              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            />
            <button
              onClick={handleUpdateUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

