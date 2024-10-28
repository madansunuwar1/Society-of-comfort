import React from "react";

const DashboardHome = () => {
  return (
    <div>
      <div className="text-5xl p-4 font-bold">Welcome to your Dashboard</div>
      <div className="flex gap-8 mx-4 mt-8">
        <div className="bg-yellow-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-yellow-700">
            120
          </h1>
          <p className="text-center text-xl text-yellow-700">Paid Invoice</p>
        </div>
        <div className="bg-red-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-red-700">120</h1>
          <p className="text-center text-xl text-red-700">UnPaid Invoice</p>
        </div>
        <div className="bg-green-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-green-700">120</h1>
          <p className="text-center text-xl text-green-700">Complaints</p>
        </div>
        <div className="bg-blue-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-blue-700">120</h1>
          <p className="text-center text-xl text-blue-700">Technical Request</p>
        </div>
        <div className="bg-orange-300 rounded-lg py-4 px-12">
          <h1 className="text-center text-3xl font-bold text-orange-700">
            120
          </h1>
          <p className="text-center text-xl text-orange-700">Security Issues</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
