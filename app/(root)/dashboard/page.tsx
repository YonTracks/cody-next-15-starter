
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        return redirect("/api/auth/signin");
    }
    const user = session?.user;
    console.log("user:", user)

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <h1>Dashboard</h1>

            <p>put your dashboardy stuff here</p>
        </div>
    );
}
