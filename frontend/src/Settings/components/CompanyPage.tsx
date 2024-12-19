import React from 'react';
import CompanyInfoCard from './CompanyInfoCard';

const CompanyPage: React.FC = () => {
  const companyData = {
    "id": 1,
    "name": "Papeleria Violeta",
    "logo": null,
    "address": "Bajos de Haina",
    "email": "papeleria@gmail.com",
    "phone": "8293171695",
    "collaborator_percentage": 40,
    "created_at": "2024-12-10T17:07:32.787612Z",
    "updated_at": "2024-12-11T15:13:43.950269Z"
  };

  return (
    <div className="h-full bg-gray-100 rounded-xl py-12 px-4 sm:px-6 lg:px-8">
      <CompanyInfoCard company={companyData} />
    </div>
  );
};

export default CompanyPage;

