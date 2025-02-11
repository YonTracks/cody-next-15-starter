

import { Header } from '@/components/header/Header'
import { User } from '@/types/User';

interface LayoutProps {
    children: React.ReactNode;
    user: User;
}

const Layout: React.FC<LayoutProps> = ({ children, user }) => {


    return (
        <div>
            <main>

                <Header user={user} />
                <div className="container mx-auto w-full py-12">{children}</div>

            </main>
        </div>
    );
}


export default Layout