
import { ReportHeader } from "./company-reports/ReportHeader";
import { ReportTable } from "./company-reports/ReportTable";
import { ReportPagination } from "./company-reports/ReportPagination";
import { useCompanyReports } from "./company-reports/useCompanyReports";

export const CompanyActivityReports = () => {
  const {
    reportType,
    setReportType,
    currentPage,
    setCurrentPage,
    totalPages,
    currentCompanies,
    getReportTitle,
    getReportDescription
  } = useCompanyReports();

  return (
    <div className="space-y-4">
      <ReportHeader 
        reportType={reportType}
        setReportType={setReportType}
        title={getReportTitle()}
        description={getReportDescription()}
      />
      
      <ReportTable
        reportType={reportType}
        companies={currentCompanies}
      />
      
      <ReportPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};
