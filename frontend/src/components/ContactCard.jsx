import React from 'react';

const ContactCard = ({ method, detail, icon, action }) => {
  return (
    <div className="flex items-center justify-between p-3 mb-2 border border-card-border rounded-xl bg-card-bg/50 hover:bg-card-bg transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-primary">{method}</h4>
          <p className="text-xs text-text-secondary">{detail}</p>
        </div>
      </div>
      <button 
        onClick={action}
        className="px-3 py-1 text-xs font-semibold rounded-lg bg-primary/10 text-secondary hover:bg-primary/30 transition-colors"
      >
        Connect
      </button>
    </div>
  );
};

export default ContactCard;
