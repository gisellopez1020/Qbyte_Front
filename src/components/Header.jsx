import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
      className={`fixed flex items-center justify-between xl:justify-start w-full py-4 px-8 h-[10vh] z-50  ${
        scrolled
          ? "bg-gradient-to-r from-primary to-secondary text-white"
          : "bg-gradient-to-b from-third to-[#ffffff]"
      } transition-all duration-500`}
    >
      <div className="xl:w-1/6 text-center -mt-4">
        <a
          href="#home"
          className="text-2xl md:text-3xl xl:text-4xl text-shadow-sm font-bold relative p-1"
        >
          QByte
          <span
            className={`${
              scrolled ? "text-white" : "text-primary"
            } text-4xl transition-all duration-500`}
          >
            .
          </span>
          <GiStarsStack
            className={`${
              scrolled ? "text-white" : "text-primary"
            } absolute bottom-1 -left-6 transition-all duration-500`}
          />
        </a>
      </div>

      <nav
        className={`fixed w-[80%] text-[#161236] font-medium md:w-[40%] xl:w-full h-full 
        bg-white xl:bg-transparent to-[#E8F3FA] 
        ${showMenu ? "left-0" : "-left-full"} ${
          scrolled ? "xl:text-white xl:text-shadow" : "text-[#161236]"
        } 
        top-0 xl:static flex-1 flex flex-col xl:flex-row 
        items-center justify-center gap-10 transition-all 
        duration-100 z-50`}
      >
        <a href="#home" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-fourth">
            Home
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-fourth transition-all duration-500 group-hover:w-full"></span>
        </a>

        <a href="#aboutUs" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-fourth">
            Sobre Nosotros
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-fourth transition-all duration-500 group-hover:w-full"></span>
        </a>

        <a href="#services" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-fourth">
            Servicios
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-fourth transition-all duration-500 group-hover:w-full"></span>
        </a>

        <a href="#contact" className="relative inline-block group">
          <span className="transition-colors duration-300 group-hover:text-fourth">
            Contacto
          </span>
          <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-fourth transition-all duration-500 group-hover:w-full"></span>
        </a>

        <Link to="/login">
          <button
            className={`${
              scrolled
                ? "bg-primary text-white border-[1px]"
                : "text-primary border-primary"
            } font-semibold px-7 p-2 border-2 rounded-[10px] relative overflow-hidden group`}
          >
            <span
              className={`${
                scrolled
                  ? "scale-x-0 origin-left border-2 border-primary bg-white rounded-[10px] transition-transform duration-500 group-hover:scale-x-100"
                  : "w-0 transition-all duration-500 group-hover:w-full"
              } absolute inset-0 bg-primary ease-in-out`}
            ></span>
            <span
              className={`${
                scrolled ? "group-hover:text-primary" : "group-hover:text-white"
              } relative z-10`}
            >
              Log in
            </span>
          </button>
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
