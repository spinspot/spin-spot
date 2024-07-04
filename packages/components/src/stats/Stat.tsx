"use client";

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

export function Stat({ stats }: StatProps) {
  return (
    <div className="stats max-lg:stats-vertical shadow">
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
  );
}
