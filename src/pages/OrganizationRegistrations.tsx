
import { Helmet } from "react-helmet";

const OrganizationRegistrations = () => {
  return (
    <>
      <Helmet>
        <title>Cadastros | Leadly</title>
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Cadastros</h1>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">Sistema de cadastros em desenvolvimento.</p>
        </div>
      </div>
    </>
  );
};

export default OrganizationRegistrations;
