import React from 'react';

const ServiceCard = ({ icon, title, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start p-4 text-left transition-all duration-300 border border-card-border rounded-xl bg-card-bg hover:bg-white/10 hover:-translate-y-1 hover:border-primary/50 group"
    >
      <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-secondary line-clamp-2">{description}</p>
    </button>
  );
};

export default ServiceCard;
