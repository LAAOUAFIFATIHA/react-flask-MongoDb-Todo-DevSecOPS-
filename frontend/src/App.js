import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/tasks").then(res => setTasks(res.data));
  }, []);

  const addTask = () => {
    if (!taskName) return;
    axios.post("http://localhost:5000/tasks", { name: taskName }).then(res => {
      setTasks([...tasks, { _id: res.data._id, name: taskName }]);
      setTaskName("");
    });
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
      setTasks(tasks.filter(task => task._id !== id));
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>TODO List</h1>
      <input value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="New task" />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.name} <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
