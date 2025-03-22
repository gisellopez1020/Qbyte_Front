import React from "react";
import { RiCheckboxBlankCircleFill } from "react-icons/ri";

const Hero = () => {
  return (
    <section id="home" className="min-h-[90vh] grid grid-cols-1 xl:grid-cols-8">
      <div className="md:col-span-5 flex items-center justify-center p-8 xl:p-20">
        <div className="flex flex-col gap-8">
          <h1 className="text-5xl xl:text-7xl font-bold text-[#161236] xl:leading-[7.5rem]">
            Automatiza y Simplifica el Cumplimiento{" "}
            <span className="text-primary py-2 px-6 border-8 border-secondary relative inline-block">
              Normativo
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -left-5 -top-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -right-5 -top-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -right-5 -bottom-5 p-2 bg-secondary rounded-full box-content" />
              <RiCheckboxBlankCircleFill className="text-white text-base absolute -left-5 -bottom-5 p-2 bg-secondary rounded-full box-content" />
            </span>
          </h1>
          <p className="text-gray-500 text-2xl xl:w-[86%] leading-[2.5rem]">
            Ahorra tiempo y minimiza errores con una plataforma diseñada para
            empresas que buscan una solución ágil, confiable y automatizada para
            su cumplimiento normativo.
          </p>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button className="w-full xl:w-auto bg-primary text-white font-bold py-3 px-8 rounded-xl text-xl">
              ¡Empieza ahora!
            </button>
          </div>
        </div>
      </div>
      <div className="md:col-span-3 flex items-center justify-center relative">
        <img
          src="qbyte.png"
          className="w-[250px] h-[250px] md:w-[550px] md:h-[450px] object-cover xl:-mt-28 relative z-10"
        />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[280px] h-[280px] md:w-[550px] md:h-[550px] bg-third border-[10px] border-primary rounded-full -z-10"></div>{" "}
      </div>
    </section>
  );
};

export default Hero;
