"use client";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateJob from "@/components/company/CreateJob";

export default function LowonganPekerjaanPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Tambah Pekerjaan" />
      <div className="space-y-6">
        <CreateJob></CreateJob>
      </div>
    </div>
  );
}
