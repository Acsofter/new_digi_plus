import React from 'react';

interface CompanyInfo {
  id: number;
  name: string;
  logo: string | null;
  address: string;
  email: string;
  phone: string;
  collaborator_percentage: number;
  created_at: string;
  updated_at: string;
}

const CompanyInfoCard: React.FC<{ company: CompanyInfo }> = ({ company }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto">
      <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{company.name}</h2>
        {company.logo ? (
          <img src={company.logo} alt={`${company.name} logo`} className="w-16 h-16 object-contain" />
        ) : (
          <div className="w-16 h-16 bg-indigo-300 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-indigo-600">
              {company.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon="📍" label="Dirección" value={company.address} />
          <InfoItem icon="📧" label="Correo Electrónico" value={company.email} />
          <InfoItem icon="📞" label="Teléfono" value={company.phone} />
          <InfoItem
            icon="💼"
            label="Porcentaje para colaboradores"
            value={`${company.collaborator_percentage}%`}
          />
        </div>
        <div className="border-t pt-4 mt-4">
          <InfoItem
            icon="🗓"
            label="Creado En"
            value={formatDate(company.created_at)}
          />
          <InfoItem
            icon="🔄"
            label="Última Actualización"
            value={formatDate(company.updated_at)}
          />
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

export default CompanyInfoCard;

