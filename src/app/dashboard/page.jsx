import { Suspense } from "react";
import Dashboard from "./components/Dashboard";

export default function Page() {
  return (
    <Suspense fallback={<div className="w-full flex justify-center items-center py-8 bg-richblack-900 text-richblack-25 font-semibold text-xl">Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}


export const metadata = {
  title: "Dashboard | Study Notion",
  description: "Study Notion Dashboard",
};