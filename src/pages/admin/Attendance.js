import React, { useState } from "react";

const Attendance = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", present: false },
    { id: 2, name: "Jane Smith", present: false },
    { id: 3, name: "Sam Wilson", present: false },
  ]);

  const toggleAttendance = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t">
              <td className="py-2 px-4">{student.name}</td>
              <td
                className={`py-2 px-4 ${
                  student.present ? "text-green-500" : "text-red-500"
                }`}
              >
                {student.present ? "Present" : "Absent"}
              </td>
              <td className="py-2 px-4">
                <button
                  className={`py-1 px-3 rounded ${
                    student.present
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                  onClick={() => toggleAttendance(student.id)}
                >
                  {student.present ? "Mark Absent" : "Mark Present"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;
