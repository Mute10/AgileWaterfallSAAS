import {useState, useEffect, useRef} from "react"

{/* 
Core features:
* Controlled form inputs (useState for title + estimate)
* Validation (ignore empty titles or invalid numbers)
* Strict number handling with Number.parseInt()
* Auto-reset the form after adding
* Smooth visual refresh of the board
*/}

export default function AgilePage() {
    const [tasks, setTasks] = useState([]);

    const nextId = useRef(1)
    const sortTasks = (taskArray) => [...taskArray].sort((a, b) =>
    a.estimate - b.estimate);

    const columns = ["To Do", "In Progress", "Done"]


    useEffect(() => {
       // On first render:
      // Simulate a short loading delay (300ms)
     // Load tasks from localStorage
    // Sort them before putting into state
        const loadTasks = async () => {
            await new Promise((resolve) => setTimeout(resolve, 300))
                const storedTasks = JSON.parse(localStorage.getItem("tasks")) || []
                setTasks(sortTasks(storedTasks))
        };
        loadTasks();
        }, []);


        useEffect(() => {
            const savedPrefs = JSON.parse(localStorage.getItem("prefs"));
            if (savedPrefs) {
                setSortBy(savedPrefs.sortBy || "estimate")
                setFilterBy(savedPrefs.filterBy || "All")
                setSearchTerm(savedPrefs.searchTerm || "")
            }
        }, [])

       



    const addTask = (title, estimate) => {
        const newTask = {
            id: nextId.current++,
            title: title.trim(),
            estimate: Number.parseInt(estimate, 10),
            status: "To Do",
            createdAt: new Date()
        };
        const updatedTasks = sortTasks([...tasks, newTask])
        setTasks(sortTasks(updatedTasks))
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

        const onDragStart = (e, taskId) => {
        e.dataTransfer.setData("taskId", taskId)
    }



    {/* state hooks */}
        const savedPrefs = JSON.parse(localStorage.getItem("prefs")) || {}
    const [toast, setToast] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newEstimate, setNewEstimate] = useState("") 
    const [sortBy, setSortBy] = useState(savedPrefs.sortBy || "estimate");
    const [filterBy, setFilterBy] = useState(savedPrefs.filterBy || "All"); 
    const[searchTerm, setSearchTerm] = useState(savedPrefs.searchTerm || "") 
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("")
    const [editedEstimate, setEditedEstimate] = useState("")
    const [dragOverColumn, setDragOverColumn] = useState(null)


            const clearPrefs = () => {
              localStorage.removeItem("prefs")
              setSortBy("estimate")
              setFilterBy("All")
              setSearchTerm("")
            }
            
   {/*} useEffect(() => { --- > REDUNDANT CODE
                const savedPrefs = JSON.parse(localStorage.getItem("prefs"))
                if (savedPrefs) {
                    if (savedPrefs.sortBy) setSortBy(savedPrefs.sortBy)
                        if (savedPrefs.filterBy) setFilterBy(savedPrefs.filterBy)
                            if (savedPrefs.searchTerm) setSearchTerm(savedPrefs.searchTerm)
                }
            }, []) */}



         const onDragOver = (e) => e.preventDefault()
        const onDrop = (e, column) => {
            const taskId = Number.parseInt(e.dataTransfer.getData("taskId"), 10)
            const updatedTasks = sortTasks(tasks.map((task) => task.id === taskId ? 
                {...task, status: column} : task));
                setTasks(updatedTasks)
                localStorage.setItem("tasks", JSON.stringify(updatedTasks))
            setDragOverColumn(null)
            };
                


useEffect(() => {
            localStorage.setItem(
                "prefs", JSON.stringify({sortBy, filterBy, searchTerm})
                )
            }, [sortBy, filterBy, searchTerm])
 
            useEffect(() => {  // Auto-hide the toast after 3 seconds. 
              if (!toast) return
              const timer = setTimeout(() => setToast(""), 3000)
              return () => clearTimeout(timer)
            }, [toast])


const startEditing = (task) => {
    setEditingTaskId(task.id)
    setEditedTitle(task.title)
    setEditedEstimate(task.estimate)
}
const saveEdit = (taskId, updatedFields = {}) => {
    setTasks((prev) => {
        const updatedTasks = prev.map((task) => 
        task.id === taskId ? {...task, ...updatedFields} : task);
    setToast("Task Saved!")
    setTimeout(() => setToast(""), 2000)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
    return sortTasks(updatedTasks)
    });
}
const cancelEdit = () => {
    setEditingTaskId(null)
    setEditedTitle("")
    setEditedEstimate("")
}

const deleteTask = (taskId) => {
  setTasks((prevTasks) => {
    const updatedTasks = prevTasks.filter((task) => task.id !==taskId);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    return updatedTasks;
  })
  if (editingTaskId === taskId) cancelEdit()
    
}


{/*}
const deleteTask = (taskId) => { --> REDUNDANT CODE
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    if (editingTaskId === taskId) cancelEdit()
}
    */}

    
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric"
    });
  }

const getVisibleTasks = () => {
    let visible = [...tasks]
    if (filterBy !== "All") {
        visible = visible.filter((task) => task.status === filterBy)
    }
    if (searchTerm.trim() !== "") {
        visible = visible.filter((task) => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    };

    if (sortBy === "estimate") {
        visible.sort((a, b) => Number(a.estimate) - Number(b.estimate))

    } else if (sortBy === "createdAt") {
        visible.sort((a, b) => new Date(a.createdAt)- new Date(b.createdAt))
    }
    return visible;
}




{/* Final Return Statement */}
return (
  <div style={{ padding: "1rem" }}>
    <h1>Agile Board</h1>


{toast && (
    <div style={{
        position: "fixed", top: "1rem",
        right: "1rem",
        background: "#007bff", color: "white",
        padding: "0.5rem 1rem",
        borderRadius: "4px",
        boxShadow: "0 2px 8px rgba(0,0,0,0,2)"
    }}>
        {toast}</div>
)}


    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newEstimate.trim()) return;
        addTask(newTitle, newEstimate);
        setNewTitle("");
        setNewEstimate("");
      }}
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1rem",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Task Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ flex: 2, padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
      />
      <input
        type="number"
        placeholder="Estimate (hrs)"
        value={newEstimate}
        onChange={(e) => setNewEstimate(e.target.value)}
        style={{ width: "120px", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px" }}
        min="0"
      />
      <button
        type="submit"
        style={{
          padding: "0.5rem 1rem",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add Task
      </button>
    </form>

    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <label>
        Sort by:{" "}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="estimate">Estimate</option>
          <option value="createdAt">Date Created</option>
        </select>
      </label>
      <label>
        Filter by:{" "}
        <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
          <option value="All">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </label>
    </div>

    <label>Search:{" "}
    <input type="text" placeholder="Search by title" value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)} style={{
        padding: "0.5rem",
        border: "1px solid #ccc",
        borderRadius: "4px", width: "200px"
    }}/></label>

    {/* Agile columns */}
    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      {columns.map((column) => (
        <div
          key={column}
          onDrop={(e) => onDrop(e, column)}
          onDragOver={onDragOver}
          style={{
            flex: 1,
            padding: "1rem",
            minHeight: "200px",
            background: dragOverColumn === column ? "#e0f7ff" : "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <h2>{column}</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
          
            {getVisibleTasks().filter((task) => task.status === column).length === 0 && (
              <li style={{ color: "#888", fontStyle: "italic" }}>No Tasks Here</li>
            )}

            {/* Tasks */}
            {getVisibleTasks()
              .filter((task) => task.status === column)
              .map((task) => (
                <li
                  key={task.id}
                  draggable={editingTaskId ? false : true}
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onDoubleClick={() => startEditing(task)}
                  style={{
                    padding: "0.5rem",
                    margin: "0.5rem 0",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    cursor: editingTaskId ? "default" : "grab",
                  }}
                >
                  {editingTaskId === task.id ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        style={{ padding: "0.3rem" }}
                        autoFocus
                      />

                      <input
                        type="number"
                        value={editedEstimate}
                        onChange={(e) => setEditedEstimate(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        style={{ padding: "0.3rem" }}
                        min="0"
                      />

                        {/* save button...DOESN'T APPEAR*/} 
                      <button
                        onClick={() => saveEdit(task.id, {title: editedTitle, estimate: editedEstimate})}
                        style={{
                          padding: "0.5rem 1rem",
                          background: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          marginTop: "0.3rem",
                        }}
                      >
                        Save
                      </button>

                      {/* Cancel button... DOESN'T APPEAR*/}
                      <button onClick={cancelEdit} style={{padding: "0.5 1rem",
                        background: "#ccc",
                        color: "#000",
                        border: "none", 
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginYop: "0.3rem"
                      }}>Cancel</button>
                    </div>
                  ) : (



                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <strong>{task.title}</strong>
                        <button
                          onClick={() => deleteTask(task.id)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#ff4d4f",
                            fontWeight: "bold",
                            cursor: "pointer",
                            marginLeft: "0.5rem",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            transition: "background 0.3s",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = "#ff4d4f";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = "transparent";
                            e.target.style.color = "#ff4d4f";
                          }}
                          title="Delete task"
                        >
                          x
                        </button>
                      </div>

                      <div>Estimate: {task.estimate}h</div>
                      <div>Status: {task.status}</div>
                      <div style={{ fontSize: "0.8rem", color: "#555" }}>
                        Created: {formatDate(task.createdAt)}
                      </div>
                    </>
                  )}
                </li>
              ))}
          </ul>
          <footer><button onClick={clearPrefs}>RESET FILTERS</button></footer>
        </div>
      ))}
    </div>
  </div>
)}
