import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CVTemplate from "@/components/resume/CVTemplate";

export default function CVPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="CV" />
      <div className="space-y-6">
        <CVTemplate />
      </div>
    </div>
  );
}
