// app/dashboard/(overview)/customers/page.tsx

import Table from "@/components/ui/customers/table";
import { fetchFilteredCustomers } from "@/lib/data";
import { SearchParams } from "@/types";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<SearchParams>;
}) {

    const params = await searchParams;
    const query = params?.query || '';

    const customersData = await fetchFilteredCustomers(query);

    return (
        <main className="flex flex-col items-center justify-center pb-24">
            <Table customers={customersData} />
        </main>
    );
}
