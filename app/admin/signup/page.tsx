import { redirect } from "next/navigation";

export const metadata = { title: "Admin sign up" };

export default function AdminSignupPage() {
  redirect("/admin/login");
}
