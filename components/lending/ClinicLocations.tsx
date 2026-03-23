import { DoctorAddress } from "@/lib/types";
import { RevealSection } from "./RevealSection";
import { LuMapPin, LuPhone, LuExternalLink } from "react-icons/lu";

interface ClinicLocationsProps {
  locations: DoctorAddress[];
}

export function ClinicLocations({ locations }: ClinicLocationsProps) {
  if (!locations || locations.length === 0) return null;

  return (
    <RevealSection animation="fade-up">
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-light text-slate-800 text-center mb-4">
            Места приёма
          </h2>
          <p className="text-lg text-slate-500 text-center max-w-2xl mx-auto mb-12">
            Я принимаю в нескольких клиниках города для вашего удобства
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {locations.map((clinic) => (
              <div
                key={clinic.id}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <h3 className="text-xl font-medium text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {clinic.clinic}
                </h3>

                <div className="space-y-4 text-sm">
                  {/* Адрес */}
                  <div className="flex items-start gap-3">
                    <div className="text-slate-400 mt-1 group-hover:text-blue-500 transition-colors">
                      <LuMapPin size={18} />
                    </div>
                    <div>
                      <span className="text-slate-600 block">
                        {clinic.address}
                      </span>
                      {clinic.map_link && (
                        <a
                          href={clinic.map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs mt-1.5 transition-colors"
                        >
                          <LuExternalLink size={12} />
                          <span>Открыть на карте</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </RevealSection>
  );
}
