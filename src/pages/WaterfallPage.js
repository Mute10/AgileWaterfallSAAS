import {useState} from "react";

function WaterfallPage() {
    const [milestones, setMilestones] = useState([
        {id: 1, title: "Requirements", start: "2025-01-01",
            end: "2025-01-10", status: "Completed"
        }]);

        const [newTitle, setNewTitle] = useState("");
        const [newStart, setNewStart] = useState("")
        const [newEnd, setNewEnd] = useState("")

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
                status: "Pending"
            };
            
            const updated = [...milestones, newItem]
            setMilestones(updated)
            localStorage.setItem("waterfall", JSON.stringify(updated))
            setNewTitle(""); setNewStart(""); setNewEnd("");
        }



        //COMPONENT STARTS
         const updateStatus = (id, newStatus) => {
                const updated = milestones.map(m => m.id === id ? {...m, 
                    status: newStatus} : m);
                    setMilestones(updated)
                    localStorage.setItem("waterfall", JSON.stringify(updated))
                }

        
 const getProgress = (status) => {
            switch(status) {
                case "Completed": return 100;
                case "In progress": return 50;
                case "Pending": return 0;
                default: return 0
            }
        }
        
            const statusBadge =({status}) => (
                <span style={{display: "inline-block", padding: "3px 8px",
                    borderRadius: "12px", background: "statusColor"[status] || "#ccc",
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
                return Math.manx(0, Math.floor(diff/(1000 * 60 * 60 *24)))
            }; const PIXELS_PER_DAY = 21


            const statusColors = {
                "Pending": "#cfcfcf",
                "In Progress": "#87cefa",
                "Completed" : "#90ee90",
            }



       return (
            <div style={{padding: "1rem"}}>
                <h2>Waterfall Page</h2>

                {/* Create Milestone*/}
                <div style={{MarginBottom: "1rem", border: "1px solid #ccc",
                    padding: "1rem", borderRadius: "8px"
                }}>
                    <h3>Create Milestone</h3>

                    <input type="text" placeholder="Milestone Title" value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}/>

                    <input type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)}/>

                    <input type="date" value={newEnd} onChange={(e) => setNewEnd(e.target.value)}/>
                    <button onClick={addMilestone}>Add</button>
                
                </div>
                {/* List milestones */}
<div>
  {milestones.map((m) => {
      const duration = getDurationDays(m.start, m.end);
            const offSetDays = getDayOffset(m.start)
            const leftOffset = offSetDays * PIXELS_PER_DAY
            const width = duration * PIXELS_PER_DAY
      return (
          <div 
              key={m.id} 
              style={{
                  padding: "0.5rem 1rem",
                  marginBottom: "0.5rem",
                  background: "#f3f3f3",
                  borderRadius: "6px"
              }}
          >
              <strong>{m.title}</strong><br/>
              {m.start} — {m.end}<br/>
              <statusBadge status={m.status}/><br/>
              <span>⏱ {duration} days</span><br/>

              {/* progress bar */}
              <div style={{
                  height: "12px",
                  width: "100%",
                  background: "#eee",
                  borderRadius: "5px",
                  marginTop: "6px"
              }}>
                  <div style={{
                      height: "100%",
                      width: `${getProgress(m.status)}%`,
                      background: statusColors[m.status],
                      borderRadius: "5px",
                      transition: "width 0.3s"
                  }} />
              </div>



              {/*Gantt Bar */}
              <div style={{position: "relative", height: "20px",
              background: "#ddd",
              borderRadius: "4px",
              marginTop: "8px",
              overflow: "hidden"

              }}> <div style={{position: 'absolute', left: `${leftOffset}px`,
              width: `${width}px`, height: "%100", background: statusColors[m.status],
              borderRadius: "4px", transition: "width 0.3s"
            }}/></div>

        {/* Date Rule: Months/Days */}
        <div style={{marginBottom: "12px", fontSize: "0.8rem"}}>

{/* MONTHS */}
<div style={{display: "flex"}}>
    {(() => {
        const earliest = new Date(Math.min(...milestones.map(m => new Date(m.start))))
        const latest = new Date(Math.max(...milestones.map(m => new Date(m.end))))
        const PIXELS_PER_DAY = 21
        let cursor = new Date(earliest)
        let monthBlocks = []
        while (cursor <= latest) {
            const startOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
            const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
            const monthStart = cursor < startOfMonth ? startOfMonth : cursor;
            const monthEnd = latest < endOfMonth ? latest:endOfMonth;
            const daysInMonth = Math.ceil((monthEnd - monthStart) / (1000*60*60*24)) + 1;

            monthBlocks.push({
                name: monthStart.toLocaleString("default", {month: "short"}),
                width: daysInMonth * PIXELS_PER_DAY
            });

            cursor = new Date(monthEnd)
            cursor.setDate(cursor.getDate() + 1);
        }
        return monthBlocks.map((block, idx) => (
            <div key={idx} style={{ width: `${block.width}px`,
        textAlign: "center", fontWeight: "bold"
        }}>
            {block.name}</div>
        ));
    })()}</div>

{/* DAYS*/}
<div style={{display: "flex"}}>
    {(() => {
        const earliest = new Date(Math.min(...milestones.map(m => new Date(m.start))))
        const latest = new Date(Math.max(...milestones.map(m => new Date(m.end))));
        const PIXELS_PER_DAY = 21
        const totalDays = Math.ceil((latest-earliest) / (1000 * 60 * 60 * 24)) +1;

        return Array.from({length: totalDays}, (_, i) => {
            const d = new Date(earliest)
            d.setDate(d.getDate() + i);
            return (
                <div key={i} style={{width: `${PIXELS_PER_DAY}px`,
            textAlign: "center", borderRight: "1px solid #ccc"}}
            > {d.getDate()}</div>
            )
        })
    })()}

</div>
</div>



              {/* status dropdown */}
              <select
                  value={m.status}
                  onChange={(e) => updateStatus(m.id, e.target.value)}
                  style={{ marginTop: "6px" }}
              >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
              </select>
          </div>
      );
  })}
</div>

            </div>
       )}
            
            
        

export default WaterfallPage;