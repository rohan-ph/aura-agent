import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PortfolioCard = ({ indices }) => {
  return (
    <div className="portfolio-section">
      <h2 className="sidebar-title">Market Pulse</h2>
      <div className="indices-grid">
        {indices.map((idx, i) => (
          <div key={i} className="index-card">
            <div className="index-name">{idx.name}</div>
            <div className="index-value">{idx.value}</div>
            <div className={`index-change ${idx.trend}`}>
              {idx.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {idx.change}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioCard;
