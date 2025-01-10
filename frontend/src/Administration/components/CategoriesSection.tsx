"use client"

import { CategoryHook } from '../hooks/CategoryHook';

export const CategoriesSection = () => {
  const { categories, loading, error, createCategory, deleteCategory, handleChangesForm, form, handleEditCategory, updateCategory, formEditing, handleChangesFormEditing, handleQuitEditCategory } = CategoryHook();


  const handleDeleteCategory = (id: number) => {
    deleteCategory(id);
  };

  if (loading) return <div>Cargando categorías...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Gestión de Categorías</h2>
      
      {/* Create Category Form */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Crear Nueva Categoría</h3>
        <input
          type="text"
          placeholder="Nombre"
          className="w-full p-2 border rounded mb-2"
          value={form.name || ''}
          onChange={(e) => handleChangesForm({ name: e.target.value})}
        />
        <input
          type="text"
          placeholder="Descripción"
          className="w-full p-2 border rounded mb-2"
          value={form.description || ''}
          onChange={(e) => handleChangesForm({ description: e.target.value})}
        />
        <button
          onClick={createCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear Categoría
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{category.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                  >
                    Editar
                  </button>
                  <button
                  disabled
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Category Modal */}
      {formEditing && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-medium mb-2">Editar Categoría</h3>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full p-2 border rounded mb-2"
              value={formEditing.name}
              onChange={(e) => handleChangesFormEditing({ name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Descripción"
              className="w-full p-2 border rounded mb-2"
              value={formEditing.description}
              onChange={(e) => handleChangesFormEditing({ description: e.target.value})}
            />
            <button
              onClick={() => updateCategory()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
            >
              Guardar Cambios
            </button>
            <button
              onClick={() => handleQuitEditCategory()}
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

