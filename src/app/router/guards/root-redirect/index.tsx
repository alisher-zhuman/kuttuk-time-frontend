import { getLaunchParams } from "@shared/helpers";

export const RootRedirect = () => {
  const params = getLaunchParams();
  const startParam = params?.tgWebAppStartParam;
  const href = window.location.href;

  return (
    <div style={{ padding: 16, wordBreak: "break-all", fontSize: 12 }}>
      <b>startParam:</b> {String(startParam)}
      <br />
      <b>href:</b> {href}
      <br />
      <b>params:</b> {JSON.stringify(params)}
    </div>
  );
};
