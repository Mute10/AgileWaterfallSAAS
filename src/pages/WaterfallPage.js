import {useState, useEffect} from "react";

export default function WaterfallPage() {
    const [milestones, setMilestones] = useState([]);

        const [newTitle, setNewTitle] = useState("");
        const [newStart, setNewStart] = useState("")
        const [newEnd, setNewEnd] = useState("")
        const [selectedId, setSelectedId] = useState(null)
        const [newDescription, setNewDescription] = useState("")


       useEffect(()=> {  // On first render: load previously-saved milestones from localStorage
        try {
            const saved = localStorage.getItem("waterfall_milestones");
            if (saved) {
                setMilestones(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load waterfall milestones", e)
        }
       }, [])

       useEffect(() => {  // Persist milestones to localStorage whenever they change
        try {
            localStorage.setItem("waterfall_milestone", JSON.stringify(milestones));
        } catch (e) {
            console.error("Failed to save waterfall milestones", e);
        }
     }, [milestones])
     useEffect(() => {  // If the selected milestone no longer exists (e.g., was deleted), clear the selection.
        if (selectedId && !milestones.find((m)=> m.id === selectedId)){
            setSelectedId(null);
        }}, [milestones, selectedId])

        
       
        const PIXELS_PER_DAY = 20; 
            

        const getDurationDays = (start, end) => {
                const s = new Date(start)
                const e = new Date(end)
                const diff = e - s
                return Math.max(1, Math.ceil(diff/(1000 * 60 * 60 * 24)))
            }
            

        const addMilestone = () => {
            if (!newTitle || !newStart || !newEnd) return;
            const newItem = {
                id: Date.now(),
                title: newTitle,
                start: newStart,
                end: newEnd,
                status: "Pending",
                description: newDescription
            };
            
            const updated = [...milestones, newItem]
            setMilestones(updated)
            localStorage.setItem("waterfall", JSON.stringify(updated))
            setNewTitle(""); setNewStart(""); setNewEnd(""); setNewDescription("")
        }
        const selectMilestone = (id) => {
            setSelectedId(id)
            {/* Auto-scroll feature*/}
            const element = document.getElementById(`m-${id}`);
            if (!element) {
                element.scrollIntoView({behavior: "smooth", block: "center"})
            }
        };


           {/* Add colors to Gantt bar */}
            const statusColors = {
                "Pending": "#90ee90",
                "In Progress": "#90ee90",
                "Completed" : "#90ee90",
                
            }
            
           

     

         useEffect(() => {
            const saved = localStorage.getItem("waterfall");
            if(saved) {
                setMilestones(JSON.parse(saved));
            }
         }, [])
         useEffect(() => {
            localStorage.setItem("waterfall_selected", JSON.stringify(selectedId))
         }, [selectedId])


         const updateStatus = (id, newStatus) => {
                const updated = milestones.map(m => m.id === id ? {...m, 
                    status: newStatus} : m);
                    setMilestones(updated)
                    localStorage.setItem("waterfall", JSON.stringify(updated))
                }

        const deleteMilestone = (id) => {
            const updated = milestones.filter((m) => m.id !== id);
            setMilestones(updated)
            localStorage.setItem("waterfall", JSON.stringify(updated))
        }

 const getProgress = (status) => {
            switch(status) {
                case "Completed": return 100;
                case "In Progress": return 50;
                case "Pending": return 1;
                default: return 0
            }
        }
        
            const StatusBadge =({status}) => (
                <span style={{display: "inline-block", padding: "3px 8px",
                    borderRadius: "12px", background: "statusColor"[status] || "black",
                    color: "White", fontSize: "0.8rem", marginTop: "4px"
                }}>{status}</span>
            );
        
            

            const getEarliestStartDate = () => {
                if(milestones.length === 0) return new Date();
                return new Date(
                Math.min(...milestones.map(m => new Date(m.start).getTime())))
            }; const earliestStart = getEarliestStartDate()

            const getDayOffset = (date) => {
                const d = new Date(date);
                const diff = d - earliestStart;
                return Math.max(0, Math.floor(diff/(1000 * 60 * 60 *24)))
            }; 
            




return ( 
  <div style={{ padding: "1rem" }}>
    <h2>Waterfall Page</h2>

    {/* Create Milestone */}
    <div style={{ marginBottom: "1rem", border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
      <h3>Create Milestone</h3>
      <input type="text" placeholder="Milestone Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
      <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} />
      <button onClick={addMilestone}>Add</button>
      <input type="text" placeholder="Milestone Description (what is the goal?)"
      value={newDescription} onChange={(e) => setNewDescription(e.target.value)}
      style={{display: "block", marginTop: "1 rem", width: "100%", }}/>
    

    </div>



    {/* List milestones */}
    <div>
      {milestones.map((m) => {
        const duration = getDurationDays(m.start, m.end);
        const offSetDays = getDayOffset(m.start);
        const leftOffset = offSetDays * PIXELS_PER_DAY;
        const width = duration * PIXELS_PER_DAY; 

        return (
          <div
            key={m.id}
            style={{ padding: "1rem 1rem", marginBottom: "1rem", background: "#f3f3f3",
              borderRadius: "10px", position: "relative", 
            }}
          >
            <strong>{m.title}</strong>
            <br />
            {m.start} — {m.end}
            <br />
            <StatusBadge status={m.status} />
            <br />
            <span>⏱ {duration} days</span>
            <br />


            {/* Gantt Bar */}
            <div
              id={`m-${m.id}`}
              onClick={() => selectMilestone(m.id)}
              style={{ cursor: "pointer", 
                border: selectedId === m.id ? "3px solid #4a90e2" : "1px solid #999", 
                borderRadius: "4px", padding: "2px" }}
            >Gantt Bar
              <div
                style={{
                  position: "relative",
                  height: "40px",
                  left: `${leftOffset}px`,
                  witdh: `${width}px`,
                  background: "#ddd",
                  borderRadius: "12px",
                  boxShadow: "0 2px 7px rgba(0,0,0,0,1)",
                  border: selectedId === m.id ?  "2px solid #4a90e2": "1px solid #ccc",
                  marginTop: "8px",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  cursor: "cell"
                }}
                onClick={() => selectMilestone(m.id)}
              >
                <div
                  style={{
                    left: 0,
                    width: `${getProgress(m.status)}%`,
                    height: "100%",
                    background: statusColors[m.status],
                    borderRadius: "12px",
                    transition: "width 0.4s ease",
                  }}
                />
              
              </div>
             </div>

            {/* status dropdown */}
            <select value={m.status} onChange={(e) => updateStatus(m.id, e.target.value)} style={{ marginTop: "6px" }}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Delete Button*/}
            <button style={{marginLeft: "8px"}} onClick={() => deleteMilestone(m.id)}> Delete </button>
          </div>
        );
      })}
    </div>

    {/* Selected milestone info */}
    {selectedId && (() => {
      const s = milestones.find((m) => m.id === selectedId);
      if(!s) return null;
      return (
        <div style={{ marginTop: "10px", padding: "10px", border: "1px solid black", borderRadius: "7px", background: "#f7f7f7", 
        width: "300px" }}>
          <h4>{s.title}</h4>
          <p>
            <b>Start: </b>
            {s.start}
          </p>
          <p>
            <b>End: </b>
            {s.end}
          </p>
          <p>
            <b>Status:</b> {s.status}
          </p>
          <p><b>Description:</b>{s.description}</p>
        </div>
      );
    })()}
  </div>
);
}
