import React from "react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const Hero = () => {
  return (
    <section id="home" className="min-h-[90vh] grid grid-cols-1 xl:grid-cols-8">
      <div className="md:col-span-5 flex items-center justify-center p-5 xl:p-16">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl xl:text-6xl font-bold text-[#161236] leading-[4rem] xl:leading-[7rem]">
            Automatiza y Simplifica el Cumplimiento{" "}
            <span className="text-primary py-2 px-6 border-8 border-secondary relative inline-block">
              Normativo
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -left-5 -top-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -right-5 -top-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -right-5 -bottom-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -left-5 -bottom-5 p-2 bg-secondary rounded-full box-content" />
            </span>
          </h1>
          <p className="text-gray-500 text-xl xl:leading-[2.5rem]">
            Ahorra tiempo y minimiza errores con una plataforma diseñada para
            empresas que buscan una solución ágil, confiable y automatizada para
            su cumplimiento normativo.
          </p>
          <div className="flex flex-col md:flex-row items-center">
            <button className="bg-primary text-white font-bold py-2 px-14 rounded-xl xl:text-xl shadow-md relative overflow-hidden group">
              <span className="absolute inset-0 scale-x-0 origin-left border-2 border-primary bg-white transition-transform duration-500 ease-in-out rounded-xl group-hover:scale-x-100"></span>
              <span className="relative z-10 group-hover:text-primary">
                ¡Empieza ahora!
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="md:col-span-3 flex items-center justify-center relative">
        <img
          src="qbyte.png"
          className="w-[300px] h-[250px] md:w-[500px] md:h-[400px] object-cover  relative z-10"
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[280px] h-[280px] md:w-[550px] md:h-[550px] bg-third border-[10px] border-primary rounded-full -z-10"></div>
        <img
          src="python.png"
          className="xl:w-20 xl:h-20 object-cover rounded-full border-l-8 border-slate-700 absolute top-[4%] right-[12%] rotate-12 w-12 h-12"
        />
        <img
          src="fastapi.png"
          className="xl:w-12 xl:h-12 object-cover rounded-full bg-teal-600 border-l-[5px] border-teal-500 absolute top-[15%] right-[6%] rotate-12 w-8 h-8"
        />
        <img
          src="react.png"
          className="xl:w-20 xl:h-20 object-cover rounded-full border-l-8 border-gray-600 absolute top-[4%] left-[10%] -rotate-12 w-12 h-12"
        />
        <img
          src="tailwind.jpg"
          className="xl:w-12 xl:h-12 object-cover rounded-full border-l-[5px] border-cyan-400 absolute top-[1%] left-[2%] -rotate-12 w-8 h-8"
        />
      </div>
    </section>
  );
};

export default Hero;
