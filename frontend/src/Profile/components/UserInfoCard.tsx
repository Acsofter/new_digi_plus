import React from 'react';

interface UserInfo {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  roles: string[];
  first_name: string;
  last_name: string;
  color: string | null;
}

export const UserInfoCard: React.FC<{ user: UserInfo }> = ({ user }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto">
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{`${user.first_name} ${user.last_name}`}</h2>
        <div className="w-16 h-16 bg-indigo-300 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-indigo-600">
            {user.first_name.charAt(0)}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon="👤" label="Nombre de usuario" value={user.username} />
          <InfoItem icon="📧" label="Correo Electrónico" value={user.email} />
          <InfoItem icon="🔐" label="Estado" value={user.is_active ? "Activo" : "Inactivo"} />
          <InfoItem icon="🎭" label="Roles" value={user.roles.join(", ")} />
        </div>
        <div className="border-t pt-4 mt-4">
          <InfoItem
            icon="🆔"
            label="ID de Usuario"
            value={user.id.toString()}
          />
          {user.color && (
            <InfoItem
              icon="🎨"
              label="Color"
              value={user.color}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start">
    <span className="text-xl mr-2">{icon}</span>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);


