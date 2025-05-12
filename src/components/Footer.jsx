import React from "react";
import { GiStarsStack } from "react-icons/gi";
import { ImWhatsapp, ImGithub } from "react-icons/im";
import { SiGmail } from "react-icons/si";
import { TiSocialLinkedin } from "react-icons/ti";
import { TbCopyright } from "react-icons/tb";

const Footer = () => {
  return (
    <section id="contact">
      <footer className="bg-[#1E5BAA] p-8 xl:p-20">
        <div className="flex items-center justify-between border-b pb-8 border-sky-600">
          <a
            href="#home"
            className="text-2xl md:text-2xl xl:text-3xl text-shadow-sm font-bold text-white relative p-1"
          >
            QByte
            <span className="text-primary text-4xl">.</span>
            <GiStarsStack className="text-primary absolute bottom-1 -left-6" />
          </a>
          <nav className="flex items-center gap-4">
            <a
              href=""
              className="block text-xl bg-black text-primary rounded-full p-3"
            >
              <ImWhatsapp />
            </a>
            <a
              href=""
              className="block text-xl bg-white text-primary rounded-full p-3"
            >
              <SiGmail />
            </a>
            <a
              href=""
              className="block text-xl bg-white text-primary rounded-full p-3"
            >
              <ImGithub />
            </a>
            <a
              href=""
              className="block text-2xl bg-white text-primary rounded-full p-3"
            >
              <TiSocialLinkedin />
            </a>
          </nav>
        </div>
        <div className="flex justify-center items-center text-center gap-1 mt-8">
          <TbCopyright className="text-white" />
          <p className="text-white italic">
            Qbyte 2025 - Todos los derechos reservados
          </p>
        </div>
      </footer>
    </section>
  );
};

export default Footer;
