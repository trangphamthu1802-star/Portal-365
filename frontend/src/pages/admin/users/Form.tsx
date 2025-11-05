import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, useRoles, useUserMutations } from '../../../hooks/useUsers';
import { LoadingSpinner, Toast } from '../../../components/Common';
import ConfirmModal from '../../../components/Common';

export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const userId = id ? parseInt(id) : 0;

  const { data: user, isLoading: loadingUser } = useUser(userId);
  const { data: roles, isLoading: loadingRoles } = useRoles();
  const { createUser, updateUser, deleteUser } = useUserMutations();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    is_active: true,
  });
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: '',
        full_name: user.full_name,
        is_active: user.is_active,
      });
      setSelectedRoles(user.roles?.map((r: { id: number }) => r.id) || []);
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isEdit && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.full_name) {
      newErrors.full_name = 'Full name is required';
    }

    if (selectedRoles.length === 0) {
      newErrors.roles = 'At least one role must be selected';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isEdit) {
        await updateUser.mutateAsync({
          id: userId,
          data: {
            email: formData.email,
            full_name: formData.full_name,
            is_active: formData.is_active,
          },
        });
        setToast({ message: 'User updated successfully', type: 'success' });
      } else {
        await createUser.mutateAsync({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          role_ids: selectedRoles,
        });
        setToast({ message: 'User created successfully', type: 'success' });
      }

      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (error: unknown) {
      const err = error as { code: string; message: string };
      setToast({ message: err.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
      setToast({ message: 'User deleted successfully', type: 'success' });
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (error: unknown) {
      const err = error as { code: string; message: string };
      setToast({ message: err.message || 'Delete failed', type: 'error' });
      setShowDeleteModal(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  if ((isEdit && loadingUser) || loadingRoles) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">{isEdit ? 'Edit User' : 'Create User'}</h1>
          <button onClick={() => navigate('/admin/users')} className="text-gray-600 hover:text-gray-900">
            ← Back to List
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password (only for create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
              />
              {errors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                errors.full_name ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-invalid={!!errors.full_name}
              aria-describedby={errors.full_name ? 'fullname-error' : undefined}
            />
            {errors.full_name && (
              <p id="fullname-error" className="mt-1 text-sm text-red-600">
                {errors.full_name}
              </p>
            )}
          </div>

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {roles?.map((role: { id: number; name: string; description: string }) => (
                <label key={role.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    {role.name} - <span className="text-gray-500">{role.description}</span>
                  </span>
                </label>
              ))}
            </div>
            {errors.roles && <p className="mt-1 text-sm text-red-600">{errors.roles}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t">
            <div>
              {isEdit && (
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete User
                </button>
              )}
            </div>
            <div className="space-x-3">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createUser.isPending || updateUser.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {createUser.isPending || updateUser.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteUser.isPending}
      />
    </div>
  );
}
