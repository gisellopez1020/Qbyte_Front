import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiStarsStack } from "react-icons/gi";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="flex items-center justify-between bg-gradient-to-b from-third to-[#ffffff] xl:justify-start w-full py-4 px-8 h-[10vh] z-50">
      <div className="xl:w-1/6 text-center -mt-4">
        <Link to="/" className="text-2xl md:text-3xl xl:text-4xl text-shadow-sm font-bold relative p-1">
          QByte<span className="text-primary text-4xl">.</span>
          <GiStarsStack className="absolute bottom-1 -left-6 text-primary" />
        </Link>
      </div>

      <nav className={`fixed w-[80%] text-[#161236] font-medium md:w-[40%] xl:w-full h-full 
        bg-white xl:bg-transparent to-[#E8F3FA] 
        ${showMenu ? "left-0" : "-left-full"} 
        top-0 xl:static flex-1 flex flex-col xl:flex-row 
        items-center justify-center gap-10 transition-all 
        duration-500 z-50`}>
        
        <Link to="/" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Home
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </Link>

        <Link to="/about" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Sobre Nosotros
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </Link>

        <Link to="/services" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Servicios
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </Link>

        <Link to="/contact" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Contacto
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </Link>

        <Link to="/login">
          <button className="font-bold text-primary px-7 p-2 border-2 border-primary rounded-[10px] relative overflow-hidden group">
            <span className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full"></span>
            <span className="relative z-10 group-hover:text-white">Log in</span>
          </button>
        </Link>
      </nav>

      <button onClick={() => setShowMenu(!showMenu)} className="xl:hidden text-2xl p-2">
        {showMenu ? <RiCloseLine /> : <RiMenu3Fill />}
      </button>
    </header>
  );
};

export default Header;
