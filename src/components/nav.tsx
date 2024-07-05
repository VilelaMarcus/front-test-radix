"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
                    <div className="relative" onClick={() => console.log('teste')}>
                        <PersonOutlinedIcon className="w-6 h-6 text-white cursor-pointer"/>
                        <div className="absolute hidden bg-transparent text-white p-1 rounded-md right-0 top-full mt-1 group-hover:block">
                            <span className="whitespace-nowrap">Log Out</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;