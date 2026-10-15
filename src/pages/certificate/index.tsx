import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import { CertificateDetail, CertificateNotFound } from "@widgets/certificate";

import { useMyCertificatesQuery } from "@entities/certificate";

import { ErrorState } from "@shared/ui";

// No single-certificate endpoint: the detail comes from the "my" list (usually
// already cached from the profile tab).
export const CertificatePage = () => {
  const { certificateId } = useParams<{ certificateId: string }>();

  const { certificates, isLoading, isError, isFetching, retry } = useMyCertificatesQuery();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  }

  const certificate = certificates.find(({ id }) => id === certificateId);

  if (!certificate) {
    return <CertificateNotFound />;
  }

  return <CertificateDetail certificate={certificate} />;
};
