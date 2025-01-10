import { useEffect, useState } from 'react';
import { useUserServices } from '../../services/user.services';

export const CategoryHook = () => {
  const { getCategories, createCategory: createCategoryService, updateCategory: updateCategoryService } = useUserServices();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Category>>({});
  const [formEditing, setFormEditing] = useState<Partial<Category> | null>(null);

  const handleEditCategory = (category: Category) => {
    setFormEditing({
      id: category.id,
      name: category.name,
      description: category.description
    });
  };

  const handleQuitEditCategory = () => {
    setFormEditing(null);
    setForm({});
  };

  const handleChangesFormEditing = (changes: { [key: string]: string }) => {
    const updatedForm = { ...formEditing, ...changes };
    setFormEditing(updatedForm);
  };

  const handleChangesForm = (changes: { [key: string]: string }) => {
    const updatedForm = { ...form, ...changes };
    setForm(updatedForm);
  };

  

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      if (response) {
        setCategories(response.results);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async () => {
    try {
      const response = await createCategoryService(form);
      if (response) {
        setCategories([...categories, response]);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setError("Error creating category");
    }
  };

  const updateCategory = async () => {
    if (!formEditing || !formEditing.id) return;
    try {

      const { id, ...data } = formEditing;
      const response = await updateCategoryService({id, data});
      if (response) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError("Error updating category");
    }
  };

  const deleteCategory = async (id: number) => {
    return;    
  };

  return {
    form,
    error,
    loading,
    categories,
    formEditing,
    updateCategory,
    deleteCategory,
    createCategory,
    handleChangesForm,
    handleEditCategory,
    handleQuitEditCategory,
    handleChangesFormEditing
  };
};

