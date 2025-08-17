import { getUserDetails } from "../utils/Login";
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { useState, useEffect } from "react";


export function Admin({ poolContention, socket }) {
  const userData = getUserDetails();
  const [selectedPool, setSelectedPool] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending"); // Add status filter state

  const poolNames = Object.keys(poolContention).sort();

useEffect(() => {
    if (selectedPool !== "all" && !poolNames.includes(selectedPool)) {
      setSelectedPool("all");
    }
  }, [poolContention, selectedPool, poolNames]);

  const getFilteredPools = () => {
    let pools;
    if (selectedPool === "all") {
      pools = poolContention;
    } else {
      pools = { [selectedPool]: poolContention[selectedPool] || [] };
    }
    
   
    const filtered = {};
    Object.keys(pools).forEach(poolName => {
      const contentions = pools[poolName] || [];
      if (statusFilter === "pending") {
        filtered[poolName] = contentions.filter(contention => contention.status === "pending");
      } else if (statusFilter === "reviewed") {
        filtered[poolName] = contentions.filter(contention => 
          contention.status === "accepted" || contention.status === "rejected"
        );
      } else {
        filtered[poolName] = contentions;
      }
    });
    return filtered;
  };


  const getStatusCounts = () => {
    let pending = 0;
    let reviewed = 0;
    let total = 0;

    const currentPools = selectedPool === "all" ? poolContention : { [selectedPool]: poolContention[selectedPool] || [] };
    
    Object.values(currentPools).forEach(contentions => {
      contentions.forEach(contention => {
        total++;
        if (contention.status === "pending") {
          pending++;
        } else if (contention.status === "accepted" || contention.status === "rejected") {
          reviewed++;
        }
      });
    });

    return { pending, reviewed, total };
  };

  const statusCounts = getStatusCounts();
  const filteredPools = getFilteredPools();

  return (
    <>
      <div className="container">
        
<div className="filters" style={{
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "flex-start", 
  gap: "20px", 
  marginBottom: "20px",
  flexWrap: "wrap"
}}>
  
  <div className="pool-filter-nav" style={{ 
    flex: "1", 
    minWidth: "300px",
    alignItems:"flex-start", 
    justifyContent:"flex-start" 
  }}>
    <h3 className="pool-name-new" style={{  marginBottom: "10px" }}>
      Filter by Pool
    </h3>
   
    <div className="pool-filter-buttons" style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: "10px", 
      alignItems:"flex-start", 
      justifyContent:"flex-start" 
    }}>
      <button
        className={`pool-filter-btn ${selectedPool === "all" ? "active" : ""}`}
        onClick={() => setSelectedPool("all")}
        style={{
          padding: "8px 16px",
          backgroundColor: selectedPool === "all" ? "#7f7fff" : "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
      >
        All Pools ({Object.values(poolContention).reduce((total, pool) => total + pool.length, 0)})
      </button>
      {poolNames.map((pool) => (
        <button
          key={pool}
          className={`pool-filter-btn ${selectedPool === pool ? "active" : ""}`}
          onClick={() => setSelectedPool(pool)}
          style={{
            padding: "8px 16px",
            backgroundColor: selectedPool === pool ? "#7f7fff" : "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "background-color 0.3s"
          }}
        >
          {pool} ({poolContention[pool]?.length || 0})
        </button>
      ))}
    </div>
  </div>

  <div className="status-filter-nav" style={{ 
    flex: "0 0 auto", 
    minWidth: "300px",
    alignItems:"flex-end", 
    justifyContent:"flex-end" 
  }}>
    <h3 className="pool-name-new" style={{ marginBottom: "10px", textAlign: "right" }}>
      Filter by Status
    </h3>
   
    <div className="status-filter-buttons" style={{ 
      display: "flex", 
      flexWrap: "wrap", 
      gap: "10px", 
      alignItems:"flex-end", 
      justifyContent:"flex-end" 
    }}>
      <button
        className={`status-filter-btn ${statusFilter === "pending" ? "active" : ""}`}
        onClick={() => setStatusFilter("pending")}
        style={{
          padding: "8px 16px",
          backgroundColor: statusFilter === "pending" ? "#ffc107" : "#6c757d",
          color: statusFilter === "pending" ? "#000" : "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
      >
        Pending ({statusCounts.pending})
      </button>
      <button
        className={`status-filter-btn ${statusFilter === "reviewed" ? "active" : ""}`}
        onClick={() => setStatusFilter("reviewed")}
        style={{
          padding: "8px 16px",
          backgroundColor: statusFilter === "reviewed" ? "#28a745" : "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
      >
        Reviewed ({statusCounts.reviewed})
      </button>
      <button
        className={`status-filter-btn ${statusFilter === "all" ? "active" : ""}`}
        onClick={() => setStatusFilter("all")}
        style={{
          padding: "8px 16px",
          backgroundColor: statusFilter === "all" ? "#7f7fff" : "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          transition: "background-color 0.3s"
        }}
      >
        All Status ({statusCounts.total})
      </button>
    </div>
  </div>

</div>

<hr style={{ border: "1px solid #7f7fff", opacity:"1", width:"100%", marginBottom: "20px"}}/>




        {Object.keys(filteredPools)
          .sort()
          .map((pool) => {
            let contentions = filteredPools[pool];
            const sortedContentions = [...contentions].sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB - dateA; 
            });
            
            
            if (sortedContentions.length === 0) {
              return null;
            }
            
            return (
              <div key={pool} style={{alignItems:"center", justifyContent:"center", justifyItems:"center"}}  >
                <h1 className="pool-name" style={{ alignItems:"center", justifyContent:"center"}}   >{pool}</h1>
                <hr style={{ border: "1px solid #7f7fff", opacity:"1", width:"100%"}}/>
                <div className="pool-section">
                  {sortedContentions.map((contention) => {
                    return (
                      <div className="feedback-card"  style={{borderBottom:"1px solid #7f7fff",borderLeft:"5px solid #7f7fff", borderTop:"1px solid #7f7fff", borderRight:"1px solid #7f7fff"}}  id="feedback-card1" key={`${contention._id}-${pool}`}>
                        <div className="feedback-header">
                          <span className={`status ${contention.status}`}>
                            {contention.status}
                          </span>
                          <p>
                            <strong>From:</strong> {contention.pool}
                          </p>
                          <p>
                            <strong>Against:</strong> {contention.againstPool}
                          </p>
                          <p>
                            <strong>Problem:</strong> {contention.headline}
                          </p>
                          {contention.description && (
                            <p>
                              <strong>Description:</strong>{" "}
                              {contention.description}
                            </p>
                          )}
                          {typeof contention.drive === 'string' && contention.drive.trim() !== '' && (
                            <p>
                              <strong>Drive Link:</strong>{" "}
                              <a
                                href={contention.drive}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#7f7fff', textDecoration: 'underline' }}
                              >
                                {contention.drive}
                              </a>
                            </p>
                          )}





                          <small className="submission-time">
                            Submitted:{" "}
                            {new Date(
                              contention.createdAt || Date.now()
                            ).toLocaleDateString("en-us",{
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                  })}




 {contention.createdAt && 
                               (Date.now() - new Date(contention.createdAt).getTime()) < 1 * 60 * 1000 && (
                                <span 
                                  style={{
                                    marginLeft: "10px",
                                    backgroundColor: "#ff4757",
                                    color: "white",
                                    padding: "2px 6px",
                                    borderRadius: "3px",
                                    fontSize: "10px",
                                    fontWeight: "bold"
                                  }}
                                >
                                  NEW
                                </span>
                              )}

                          </small>

                          {contention.status === "pending" && (
                            <div className="toggle-buttons-box">
                              <button
                                className="toggle-btn"
                                style={{ backgroundColor: "green" }}
                                onClick={() => {
                                  
                                    if(window.confirm(`✅ Are you sure you want to accept this contention?\n\nPool: ${contention.pool}\nAgainst: ${contention.againstPool}\nProblem: ${contention.headline}`))
                                  socket.emit("mark_accepted", {
                                    id: contention._id,
                                  });
                                }}
                              >
                                <VscCheck />
                              </button>
                              <button 
                                className="toggle-btn"
                                style={{ backgroundColor: "red" }}
                                onClick={() => {
                                    if(window.confirm(`❌ Are you sure you want to reject this contention?\n\nPool: ${contention.pool}\nAgainst: ${contention.againstPool}\nProblem: ${contention.headline}`))
                                  socket.emit("mark_rejected", {
                                    id: contention._id,
                                  });
                                }}
                              >
                                <VscChromeClose />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

       
        {Object.keys(filteredPools).every(pool => filteredPools[pool].length === 0) && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>No contentions found for the selected filters</h2>
            <p>Try changing the pool or status filter to see more results.</p>
          </div>
        )}
      </div>
    </>
  );
}





























