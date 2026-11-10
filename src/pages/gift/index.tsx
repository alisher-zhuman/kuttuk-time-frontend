import { useParams } from "react-router";

import { GiftNotFound, GiftScreen } from "@widgets/gift";

import { useGiftQuery } from "@entities/certificate";

import { ErrorState, PageLoader } from "@shared/ui";

// startapp=gift_<token> - the «Забрать подарок» button on a friend's card.
export const GiftPage = () => {
  const { token = "" } = useParams<{ token: string }>();

  const { gift, isLoading, isNotFound, isError, isFetching, retry } = useGiftQuery(token);

  if (isLoading) return <PageLoader />;

  // Before the data check: a claim can turn a shown link into 404 (replaced).
  if (isNotFound) return <GiftNotFound />;

  if (isError || !gift) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  return <GiftScreen token={token} gift={gift} />;
};
