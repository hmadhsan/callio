import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import prisma from '@/lib/prisma';
import AffiliateDashboardClient from './CustomAffiliateClient';

export const metadata = {
  title: 'Affiliate Program | Callio Dashboard',
};

export default async function AffiliateDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  // Find or create affiliate record for this user
  let affiliate = await prisma.affiliate.findUnique({
    where: { userId: user.id },
    include: { payouts: true }
  });

  if (!affiliate) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      redirect('/login');
    }
    
    // Generate simple referral code from email username
    const baseCode = dbUser.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'partner';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referralCode = `${baseCode}${randomSuffix}`;
    
    affiliate = await prisma.affiliate.create({
      data: {
        userId: user.id,
        referralCode,
      },
      include: { payouts: true }
    });
  }

  // Passing data down to a client component for interactivity
  return <AffiliateDashboardClient affiliate={affiliate} />;
}
