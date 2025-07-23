import { HeaderAuth } from "./_components/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderAuth />
      <main className="p-3">{children}</main>
    </>
  );
}
