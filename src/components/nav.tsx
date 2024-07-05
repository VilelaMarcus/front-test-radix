"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav
        className="p-4"
        >
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
                <PersonOutlinedIcon className="w-6 h-6 text-white cursor-pointer" />
                <div className="absolute left-0 mt-2 w-32 hidden bg-white text-black p-2 rounded shadow-md group-hover:block">
                Log-out
                </div>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;