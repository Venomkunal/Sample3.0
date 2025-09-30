// admin\src\app\admin\products\page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import AdminLayout from '../AdminLayout';
import { redirect } from 'next/navigation';
import OnsaleAdminClient from './OnsaleAdminClient';

export default async function Category() {
  const cookieStore = await cookies();
  const token = cookieStore.get('adminToken')?.value;

  if (!token) {
    redirect('/admin/login'); // ⛔ No token
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'INDIANBAZZARGUYBYKUNAL');

    if (typeof decoded === 'object' && decoded.role === 'admin') {
      // ✅ Authenticated as admin
      return (
        <AdminLayout>
           <OnsaleAdminClient />
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
