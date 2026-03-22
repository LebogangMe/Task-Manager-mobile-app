import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState<"All" | "Completed" | "Pending">("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim() || !dueDate) return;

    const newTask: Task = {
      id: Date.now(),
      title: input,
      completed: false,
      priority,
      dueDate,
    };

    setTasks([newTask, ...tasks]);
    setInput("");
    setDueDate("");
    setPriority("Medium");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  const priorityColor = (priority: string) => {
    if (priority === "High") return "#ef4444";
    if (priority === "Medium") return "#f59e0b";
    return "#10b981";
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Task Manager</h1>

        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Enter a task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={styles.dateInput}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)} style={styles.select}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button onClick={addTask} style={styles.addButton}>Add</button>
        </div>

        <div style={styles.filterContainer}>
          {(["All", "Completed", "Pending"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              ...styles.filterButton,
              backgroundColor: filter === f ? "#4f46e5" : "#e5e7eb",
              color: filter === f ? "white" : "#111827",
            }}>{f}</button>
          ))}
        </div>

        <ul style={styles.list}>
          {filteredTasks.map((task) => (
            <li key={task.id} style={styles.listItem}>
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span onClick={() => toggleTask(task.id)} style={{
                  ...styles.taskText,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed ? "#9ca3af" : "#111827",
                }}>{task.title}</span>
                <small style={{color: priorityColor(task.priority)}}>Priority: {task.priority} | Due: {task.dueDate}</small>
              </div>
              <button onClick={() => deleteTask(task.id)} style={styles.deleteButton}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "25px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "15px",
  },
  input: {
    flex: 2,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  dateInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  addButton: {
    padding: "10px 15px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  filterContainer: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  filterButton: {
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderRadius: "8px",
    backgroundColor: "#f9fafb",
    marginBottom: "10px",
  },
  taskText: {
    cursor: "pointer",
    fontWeight: 500,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default App;


