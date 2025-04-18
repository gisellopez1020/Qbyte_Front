import React from "react";

const AboutUs = () => {
  return (
    <section id="aboutUs">
      <div className="bg-gray-50 p-8 flex flex-col items-center justify-center gap-8 mt-14 xl:mt-0">
        <h1 className="text-2xl font-medium text-[#161236] tracking-wide">
          Conoce nuestro equipo
        </h1>
        <div className="flex flex-col md:flex-row items-center flex-wrap gap-10 xl:gap-32">
          <div className="flex flex-col items-center">
            <img
              src="Monica.png"
              className="xl:w-40 xl:h-40 object-cover rounded-full border-4 border-primary w-32 h-32"
            />
            <span className="mt-2 font-medium">Mónica Chicangana</span>
            <span className="italic">Desarrolladora Frontend</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="JeanE.png"
              className="xl:w-40 xl:h-40 object-cover rounded-full border-4 border-primary w-32 h-32"
            />
            <span className="mt-2 font-medium">Jean Pool Esguerra</span>
            <span className="italic">Desarrollador Backend</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="JeanA.png"
              className="xl:w-40 xl:h-40 object-cover rounded-full border-4 border-primary w-32 h-32"
            />
            <span className="mt-2 font-medium">Jean Alfred Gargano</span>
            <span className="italic">Desarrollador Backend</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="Gisel.png"
              className="xl:w-40 xl:h-40 object-cover rounded-full border-4 border-primary w-32 h-32"
            />
            <span className="mt-2 font-medium">Karen Gisel López</span>
            <span className="italic">Desarrolladora Frontend</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="JeanP.png"
              className="xl:w-40 xl:h-40 object-cover rounded-full border-4 border-primary w-32 h-32"
            />
            <span className="mt-2 font-medium">Jean Paul Ordoñez</span>
            <span className="italic">Desarrollador Backend</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
