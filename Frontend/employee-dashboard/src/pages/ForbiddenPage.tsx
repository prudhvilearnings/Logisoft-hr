import React from 'react';
import { Link } from 'react-router-dom';

const ForbiddenPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 text-slate-800 p-6">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-extrabold text-red-500 tracking-widest font-heading">403</h1>
        <div className="bg-orange-500 text-white px-2 py-1 text-sm rounded rotate-12 absolute -mt-16 ml-36">
          Access Denied
        </div>
        <h2 className="text-2xl font-bold mt-8 text-slate-900 font-heading">Restricted Access</h2>
        <p className="text-slate-500 mt-4 mb-8">
          You do not have the required permissions to view this resource. Please contact your administrator if you believe this is an error.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;
