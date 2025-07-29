import { CompanyData } from "../types";
import { CompanyDonutChart } from "../charts/CompanyDonutChart";
import { Building2, Target } from "lucide-react";

interface CompaniesTabProps {
  jobCompanyData: CompanyData[];
  applicationCompanyData: CompanyData[];
}

export const CompaniesTab = ({
  jobCompanyData,
  applicationCompanyData,
}: CompaniesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CompanyDonutChart
          data={jobCompanyData}
          title="Top Companies - Job Discovery"
          subtitle="Companies with most discovered jobs"
          icon={<Building2 className="h-4 w-4 md:h-5 md:w-5" />}
          tooltipFormatter={(value, name) => [`${value} jobs`, name]}
        />

        <CompanyDonutChart
          data={applicationCompanyData}
          title="Top Companies - Applications"
          subtitle="Companies with most applications submitted"
          icon={<Target className="h-4 w-4 md:h-5 md:w-5" />}
          tooltipFormatter={(value, name) => [`${value} applications`, name]}
        />
      </div>
    </div>
  );
};
