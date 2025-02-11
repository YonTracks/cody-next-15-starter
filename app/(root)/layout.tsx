

import { Header } from '@/components/header/Header'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {


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