"use client";

import { useEffect, useState } from "react";
import { Loader } from "../loaders";

interface StatItem {
  icon: React.ReactNode; // El icono como etiqueta HTML
  title: string; // Título de la estadística
  value: string | number | undefined; // Valor de la estadística
  description?: string; // Descripción de la estadística
  isLoading: boolean;
}

interface StatProps {
  stats: StatItem[]; // Array de estadísticas
}

export default function Stat({ stats }: StatProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isLargeScreen ? (
        <>
          <div className="stats shadow ">
            {stats.map((stat, index) => (
              <div key={index} className="stat bg-base-200 place-items-center">
                <div className="stat-figure text-primary">{stat.icon}</div>
                <div className="stat-title">{stat.title}</div>
                {stat.isLoading ? (
                  <Loader variant="dots" className="text-primary"></Loader>
                ) : (
                  <div className="stat-value">{stat.value}</div>
                )}
                {stat.description && (
                  <div className="stat-desc">{stat.description}</div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="stats shadow ">
            {stats.slice(0, Math.ceil(stats.length / 2)).map((stat, index) => (
              <div key={index} className="stat bg-base-200 place-items-center">
                <div className="stat-figure text-primary">{stat.icon}</div>
                <div className="stat-title">{stat.title}</div>
                {stat.isLoading ? (
                  <Loader variant="dots" className="text-primary"></Loader>
                ) : (
                  <div className="stat-value">{stat.value}</div>
                )}
                <div className="stat-desc">{stat.description}</div>
              </div>
            ))}
          </div>
          <div className="stats shadow">
            {stats
              .slice(Math.ceil(stats.length / 2), stats.length)
              .map((stat, index) => (
                <div
                  key={index}
                  className="stat bg-base-200 place-items-center"
                >
                  <div className="stat-figure text-primary">{stat.icon}</div>
                  <div className="stat-title">{stat.title}</div>
                  {stat.isLoading ? (
                    <Loader variant="dots" className="text-primary"></Loader>
                  ) : (
                    <div className="stat-value">{stat.value}</div>
                  )}
                  <div className="stat-desc">{stat.description}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
