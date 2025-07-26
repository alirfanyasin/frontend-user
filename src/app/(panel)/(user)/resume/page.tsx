import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import Step from '@/components/resume/Step';

export default function ResumePage() {
  return (
    <div>

      <PageBreadcrumb pageTitle="Resume"/>
      <div className="space-y-6">
        <Step/>
      </div>
    </div>
  )
}
