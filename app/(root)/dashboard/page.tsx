// app/dashboard/page.tsx

import { lusitana } from '@/components/ui/fonts';
import { fetchLatestInvoices } from '@/lib/data';
import { Suspense } from 'react';
import { RevenueChartSkeleton, CardsSkeleton } from '@/components/ui/skeletons';
import CardWrapper from '@/components/ui/dashboard/cards';
import LatestInvoices from '@/components/ui/dashboard/latest-invoices';
import RevenueChart from '@/components/ui/dashboard/revenue-chart';

export default async function Page() {
    const latestInvoices = await fetchLatestInvoices();

    return (
        <main className="flex flex-col items-center justify-center pb-24 md:pb-2">
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <CardWrapper />
                </Suspense>
            </div>
            {/* Stack RevenueChart above LatestInvoices */}
            <div className="w-full mt-6 flex flex-col gap-6">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <LatestInvoices latestInvoices={latestInvoices} />
            </div>
        </main>
    );
}
