import { Suspense } from "react";
import Dashboard from "./components/Dashboard";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}


export const metadata = {
  title: "Dashboard | Study Notion",
  description: "Study Notion Dashboard",
};