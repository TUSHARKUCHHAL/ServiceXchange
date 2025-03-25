// import React, { useState } from "react";
// import "./TaskList.css";

// const TaskList = () => {
//   const [tasks, setTasks] = useState([
//     { id: 1, title: "Blood Donation Drive", date: "2025-03-10", description: "Join us for a life-saving blood donation event." },
//     { id: 2, title: "Food Distribution", date: "2025-03-15", description: "Help distribute food to those in need." },
//   ]);

//   const [newTask, setNewTask] = useState({ title: "", date: "", description: "" });
//   const [showNotification, setShowNotification] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTask({ ...newTask, [name]: value });
//   };

//   const addTask = () => {
//     if (!newTask.title || !newTask.date || !newTask.description) return;

//     setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
//     setNewTask({ title: "", date: "", description: "" });

//     setShowNotification(true);
//     setTimeout(() => setShowNotification(false), 3000);
//   };

//   return (
//     <div className="task-container">
//       <h1>Task List - NGO Drives</h1>

//       <div className="task-form">
//         <input
//           type="text"
//           name="title"
//           placeholder="Task Title"
//           value={newTask.title}
//           onChange={handleInputChange}
//         />
//         <input
//           type="date"
//           name="date"
//           value={newTask.date}
//           onChange={handleInputChange}
//         />
//         <textarea
//           name="description"
//           placeholder="Task Description"
//           value={newTask.description}
//           onChange={handleInputChange}
//         />
//         <button onClick={addTask}>Add Task</button>
//       </div>

//       {showNotification && <p className="notification">New task added successfully! 📢</p>}

//       <div className="task-list">
//         {tasks.map((task) => (
//           <div key={task.id} className="task-card">
//             <h3>{task.title}</h3>
//             <p><strong>Date:</strong> {task.date}</p>
//             <p>{task.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TaskList;
