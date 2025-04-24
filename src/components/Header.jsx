import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiStarsStack } from "react-icons/gi";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <header className="flex items-center justify-between border-b border-secondary dark:border-third bg-gradient-to-b from-third to-[#E8F3FA] xl:justify-start w-full py-4 px-8 h-[10vh] z-50">
      <div className="xl:w-1/6 text-center -mt-4">
      <Link to="/" className="text-2xl xl:text-4xl font-bold relative p-1">
      QByte<span className="text-primary text-4xl">.</span>
      <GiStarsStack className="absolute bottom-1 -left-6 text-primary" />
    </Link>
      </div>
      <nav
        className={`fixed w-[80%] md:w-[40%] xl:w-full h-full 
    bg-white xl:bg-transparent to-[#E8F3FA] 
    ${showMenu ? "left-0" : "-left-full"} 
    top-0 xl:static flex-1 flex flex-col xl:flex-row 
    items-center justify-center gap-10 transition-all 
    duration-500 z-50`}
      >
        <a href="#" className="">
          Home
        </a>
        <a href="#" className="">
          Sobre Nosotros
        </a>
        <a href="#" className="">
          Servicios
        </a>
        <a href="#" className="">
          Contacto
        </a>
        
        <Link to="/login" className="bg-primary font-bold text-white px-7 p-2 rounded-[10px]">
  Log in
</Link>
      </nav>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="xl:hidden text-2xl p-2"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Fill />}
      </button>
    </header>
  );
};

export default Header;
