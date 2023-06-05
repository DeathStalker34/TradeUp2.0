'use client'

import { BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
import Container from "../Container";


const Navbar = () => {
    return (

        <footer className="hidden fixed bottom-0 left-0 z-20 w-full p-5 border-t shadow lg:flex lg:items-center lg:justify-between dark:bg-white mt-5">
            <span className="text-sm text-gray-700 sm:text-center">© 2023 <a href="#" className="hover:underline">Tiago Rodrigues</a>. All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center text-xl text-gray-700">
                <li>
                    <a href="#"><BsInstagram className="mr-8 hover:text-pink-700 lg:mr-6" /></a>
                </li>
                <li>
                    <a href="#"><BsGithub className="mr-8 hover:text-purple-700 lg:mr-6" /></a>
                </li>
                <li>
                    <a href="#"><BsTwitter className="mr-8 hover:text-blue-500 lg:mr-2" /></a>
                </li>

            </ul>
        </footer>

    );
}

export default Navbar;