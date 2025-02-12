// app/(root)/home/page.tsx

import React from "react";
import { auth } from "@/auth";

async function HomePage() {
    const session = await auth();
    // console.log("Session:", session)
    return (
        <main className="flex flex-col items-center justify-between p-24">
            <h2>Hello</h2>
            {session?.user?.name || "No User"}

            <section>
                <div>

                </div>
            </section>
        </main>
    );
}

export default HomePage;
