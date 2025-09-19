// admin\src\app\admin\products\page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import AdminLayout from '../AdminLayout';
import { redirect } from 'next/navigation';
import ProductAdminClient from './ProductAdminClient';

export default async function Product() {
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
           <ProductAdminClient />
        </AdminLayout>
      );
    } else {
      redirect('/admin/login'); // ⛔ Not an admin
    }
  } catch {
    // console.error('JWT error:', err);
    alert('Invalid token')
    redirect('/admin/login'); // ⛔ Invalid token
  }
}
