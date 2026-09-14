import { Link, Outlet } from "react-router-dom";
import { GridIcon, TableIcon } from "../icons";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
};

const navItems: NavItem[] = [
    { icon: <GridIcon />, name: "Dashboard", path: "/" },
    { icon: <TableIcon />, name: "Products", path: "/products" }
];

const MenuBar = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">

            <header className="w-full h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h1>
                <nav>
                    <ul className="flex items-center space-x-4">
                        {navItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path || "#"}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 transition-colors"
                                >
                                    {item.icon}
                                    <span className="ml-2">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>


            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default MenuBar;