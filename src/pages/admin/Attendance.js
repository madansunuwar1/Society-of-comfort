import React, { useState, useEffect } from "react";
import api from "../../utils/api"; // Adjust the path according to your file structure

const Attendance = () => {
  const [students, setStudents] = useState([]);

  // Fetch attendance data from the API
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await api.get("/attendances");
        // Assuming the response data is an array of students
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  const toggleAttendance = async (student) => {
    const userId = student.id; // Use the student's ID
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in YYYY-MM-DD format

    const payload = {
      user_id: userId,
      date: currentDate,
    };

    // Send POST request to mark attendance
    try {
      await api.post("/attendances", payload);
      // Toggle attendance state locally after successful post
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === userId
            ? { ...student, present: !student.present }
            : student
        )
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Attendance</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="border-t">
              <td className="py-2 px-4">{student.name}</td>

              <td className="py-2 px-4">
                <button
                  className={`py-1 px-3 rounded ${
                    student.present
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                  onClick={() => toggleAttendance(student)}
                >
                  {student.present ? "already checked in" : "Checked in"}
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
