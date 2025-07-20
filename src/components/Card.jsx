import React from "react";

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-4 border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = "" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = "" }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-800 ${className}`}>
      {children}
    </h2>
  );
};

const CardContent = ({ children, className = "" }) => {
  return (
    <div className={`text-sm text-gray-700 ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardTitle, CardContent };
