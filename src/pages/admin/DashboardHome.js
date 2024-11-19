import React from "react";

const DashboardHome = () => {
  return (
    <div className="mx-4">
      <div className="text-5xl p-4 font-bold">Welcome to your Dashboard</div>
      <div className="flex gap-8  mt-8">
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
      <div className="flex justify-between gap-4 mt-8">
        <div className="p-4 bg-gray-300 rounded-lg w-full h-full">
          <h2 className="text-xl font-semibold mb-4">Remaining Dues </h2>
          <div className="bg-white p-4 rounded-lg overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-4 border-r border-b border-gray-300">
                    House Number
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300">
                    Name
                  </th>
                  <th className="py-2 px-4 border-r border-b border-gray-300">
                    Total dues
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className=" hover:bg-gray-50 border-b">
                  <td className="py-2 px-4 border-r border-gray-300">HN-2</td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    Ramesh shrestha
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    NPR 30050.00
                  </td>
                </tr>
                <tr className=" hover:bg-gray-50 border-b">
                  <td className="py-2 px-4 border-r border-gray-300">HN-4</td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    User0004
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    NPR 25050.00
                  </td>
                </tr>
                <tr className=" hover:bg-gray-50 border-b">
                  <td className="py-2 px-4 border-r border-gray-300">HN-3</td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    Shyam Bahadur
                  </td>
                  <td className="py-2 px-4 border-r border-gray-300">
                    NPR 4000.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="p-4 bg-gray-300 rounded-lg w-full h-full">
          <h2 className="text-xl font-semibold mb-4">Todays Notice </h2>
          <div className="bg-white p-4 rounded-lg overflow-x-auto">
            <div className="">
              <h1 className="text-lg font-semibold mb-4">
                Everybody Is Requested to Attend todays meeting
              </h1>
              <p className="">
                This is to inform all team members that a meeting is scheduled
                for today.
                <br />
                Your presence is highly encouraged, as important topics will be
                discussed.
                <br />
                <br />
                <strong>Details of the Meeting:</strong>
                <br />
                <strong>Date:</strong> 2081/07/04
                <br />
                <strong>Time:</strong> 19:00 pm
                <br />
                <strong>Venue:</strong> first hall
                <br />
                <strong>Agenda:</strong> policy changes in the society
                <br />
                <br />
                Please make every effort to attend and be on time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
