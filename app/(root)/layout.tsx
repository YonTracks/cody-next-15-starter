

import { Header } from '@/components/header/Header'

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <main>

                <Header />
                <div className="container mx-auto w-full py-12">{children}</div>

            </main>
        </div>
    );
}


export default Layout