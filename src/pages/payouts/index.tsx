import { useTranslation } from "react-i18next";

import { PayoutDueList, PayoutReport } from "@widgets/payouts";

import { useSearchParamState } from "@shared/hooks";
import { SegmentedControl } from "@shared/ui";

type View = "week" | "due";

// ?view=due - «Все долги» (the Monday reminder's button opens it); otherwise
// the weekly report, on ?week= or the previous week.
export const PayoutsPage = () => {
  const [viewParam, setView] = useSearchParamState("view");

  const { t } = useTranslation();

  const view: View = viewParam === "due" ? "due" : "week";

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("admin.payouts.title")}
      </h1>

      <SegmentedControl
        items={[
          { value: "week", label: t("admin.payouts.viewWeek") },
          { value: "due", label: t("admin.payouts.viewDue") }
        ]}
        value={view}
        onChange={(next: View) => setView(next === "due" ? "due" : null)}
      />

      {view === "due" ? <PayoutDueList /> : <PayoutReport />}
    </div>
  );
};
