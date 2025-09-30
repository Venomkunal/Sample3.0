// admin\src\app\admin\page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import AdminLayout from './AdminLayout';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const cookieStore = await cookies(); // No need to await cookies()
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    // redirect(''); // ⛔ No token
    return <div>Admin Dashboard</div>;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'INDIANBAZZARGUYBYKUNAL');

    if (typeof decoded === 'object' && decoded.role === 'admin') {
      // ✅ Authenticated as admin
      return (
        <AdminLayout>
          <h1>Welcome Admin</h1>
        </AdminLayout>
      );
    } else {
      redirect('/admin/loin'); // ⛔ Not an admin
    }
  } catch (err) {
    console.error('JWT error:', err);
    redirect('/admin/logi'); // ⛔ Invalid token 
  }
}
