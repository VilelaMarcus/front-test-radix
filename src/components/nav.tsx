"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-gray-900">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    <Link href="/" legacyBehavior>
                        <a>
                            <Image
                                src="/images/logo.png"
                                alt="Logo"
                                width={100}
                                height={50}
                            />
                        </a>
                    </Link>
                </div>            
                <div className="relative group">
                <div className="flex items-center" onClick={() => (window.location.href="/api/auth/logout")}>
                    <PersonOutlinedIcon className="w-6 h-6 text-white cursor-pointer"/>
                    <span className="text-white ml-1 relative group cursor-pointer">
                        <span className="transition-all relative group hover:border-b-2 border-white">Log Out</span>
                    </span>
                </div>
            </div>
            </div>
        </nav>
    );
};

export default Navbar;