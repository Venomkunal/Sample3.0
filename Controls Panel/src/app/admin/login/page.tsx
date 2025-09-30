// admin/src/app/admin/login/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import LoginForm from "./LoginForm";

export default async function AdminLoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("adminToken");

  if (token) {
    const decoded = jwt.verify(token.value, process.env.SECRET_KEY!);

    if (typeof decoded === "object" && decoded.role === "admin") {
      redirect("/admin"); // ✅ This will throw NEXT_REDIRECT internally
    }
  }

  return <LoginForm />;
}
