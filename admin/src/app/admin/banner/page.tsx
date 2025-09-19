// admin\src\app\admin\banner\page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import AdminLayout from '../AdminLayout';
import BannerAdminClient from './BannerAdminClient';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    // console.log('no');
    redirect('/admin/login'); // ⛔ No token
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'INDIANBAZZARGUYBYKUNAL');

    if (typeof decoded === 'object' && decoded.role === 'admin') {
      // ✅ Authenticated as admin
      return (
        <AdminLayout>
           <BannerAdminClient />
        </AdminLayout>
      );
    } else {
      redirect('/admin/login'); // ⛔ Not an admin
    }
  } catch {
    // console.error('JWT error:', err);
    redirect('/admin/login'); // ⛔ Invalid token
  }
}