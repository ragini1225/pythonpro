import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-emerald-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;