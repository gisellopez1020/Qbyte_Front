import React, { useEffect, useState } from "react";
import { GiStarsStack } from "react-icons/gi";
import { RiMenu3Fill, RiCloseLine } from "react-icons/ri";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed flex items-center justify-between xl:justify-start w-full py-4 px-8 h-[10vh] z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-gradient-to-r from-[#b3d7eddf] to-white"
          : "bg-gradient-to-b from-third to-[#ffffff]"
      }`}
    >
      <div className="xl:w-1/6 text-center -mt-4">
        <a
          href="#home"
          className="text-2xl md:text-3xl xl:text-4xl text-shadow-sm font-bold relative p-1"
        >
          QByte<span className="text-primary text-4xl">.</span>
          <GiStarsStack className="absolute bottom-1 -left-6 text-primary" />
        </a>
      </div>
      <nav
        className={`fixed w-[80%] text-[#161236] font-medium md:w-[40%] xl:w-full h-full 
    bg-white xl:bg-transparent to-[#E8F3FA] 
    ${showMenu ? "left-0" : "-left-full"} 
    top-0 xl:static flex-1 flex flex-col xl:flex-row 
    items-center justify-center gap-10 transition-all 
    duration-500 z-50`}
      >
        <a href="#home" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Home
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </a>
        <a href="#aboutUs" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Sobre Nosotros
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </a>
        <a href="#services" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Servicios
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </a>
        <a href="#" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-primary">
            Contacto
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full"></span>
        </a>
        <button className="font-bold text-primary px-7 p-2 border-2 border-primary rounded-[10px] relative overflow-hidden group">
          <span className="absolute inset-0 w-0 bg-primary transition-all duration-500 ease-in-out group-hover:w-full"></span>
          <span className="relative z-10 group-hover:text-white">Log in</span>
        </button>
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
