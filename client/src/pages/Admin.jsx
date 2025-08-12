import { getUserDetails } from "../utils/Login";
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { useState, useEffect } from "react";


export function Admin({ poolContension, socket }) {
  const userData = getUserDetails();
  const [selectedPool, setSelectedPool] = useState("all");

  const poolNames = Object.keys(poolContension).sort();

useEffect(() => {
    if (selectedPool !== "all" && !poolNames.includes(selectedPool)) {
      setSelectedPool("all");
    }
  }, [poolContension, selectedPool, poolNames]);

  const getFilteredPools = () => {
    if (selectedPool === "all") {
      return poolContension;
    } else {
      return { [selectedPool]: poolContension[selectedPool] || [] };
    }
  };

  const filteredPools = getFilteredPools();

  return (
    <>
      <div className="container">
        

 <div className="pool-filter-nav" style={{ marginBottom: "15px", alignItems:"center", justifyContent:"center", justifyItems:"center" }}>
          <h3 className="pool-name-new" style={{  marginBottom: "10px" }}>
           
            Filter by Pool
            

          </h3>
         
          <div className="pool-filter-buttons" style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems:"center", justifyContent:"center", justifyItems:"center" }}>
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
              All Pools ({Object.values(poolContension).reduce((total, pool) => total + pool.length, 0)})
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
                {pool} ({poolContension[pool]?.length || 0})
              </button>
              
            ))}
             <hr style={{ border: "1px solid #7f7fff", opacity:"1", width:"100%"}}/>
          </div>
        </div>



        {Object.keys(filteredPools)
          .sort()
          .map((pool) => {
            let contensions = filteredPools[pool];
            const sortedContentions = [...contensions].sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB - dateA; // Newest first
            });
            return (
              <div key={pool} style={{alignItems:"center", justifyContent:"center", justifyItems:"center"}}  >
                <h1 className="pool-name" style={{ alignItems:"center", justifyContent:"center"}}   >{pool}</h1>
                <hr style={{ border: "1px solid #7f7fff", opacity:"1", width:"100%"}}/>
                <div className="pool-section">
                  {sortedContentions.length > 0 ? (
                    sortedContentions.map((contension) => {
                      return (
                        <div className="feedback-card"  style={{borderBottom:"1px solid #7f7fff",borderLeft:"5px solid #7f7fff", borderTop:"1px solid #7f7fff", borderRight:"1px solid #7f7fff"}}  id="feedback-card1" key={`${contension._id}-${pool}`}>
                          <div className="feedback-header">
                            <span className={`status ${contension.status}`}>
                              {contension.status}
                            </span>
                            <p>
                              <strong>From:</strong> {contension.pool}
                            </p>
                            <p>
                              <strong>Against:</strong> {contension.againstPool}
                            </p>
                            <p>
                              <strong>Problem:</strong> {contension.headline}
                            </p>
                            {contension.para && (
                              <p>
                                <strong>Description:</strong>{" "}
                                {contension.description}
                              </p>
                            )}
                            {contension.drive && (
                              <p>
                                <strong>drive:</strong>{" "}
                                <a
                                  href={contension.drive}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {contension.drive}
                                </a>
                              </p>
                            )}

                            <small className="submission-time">
                              Submitted:{" "}
                              {new Date(
                                contension.createdAt || Date.now()
                              ).toLocaleDateString("en-us",{
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                    })}




 {contension.createdAt && 
                               (Date.now() - new Date(contension.createdAt).getTime()) < 30 * 60 * 1000 && (
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

                            {contension.status === "pending" && (
                              <div className="toggle-buttons-box">
                                <button
                                  className="toggle-btn"
                                  style={{ backgroundColor: "green" }}
                                  onClick={() => {
                                    socket.emit("mark_accepted", {
                                      id: contension._id,
                                    });
                                  }}
                                >
                                  <VscCheck />
                                </button>
                                <button
                                  className="toggle-btn"
                                  style={{ backgroundColor: "red" }}
                                  onClick={() => {
                                    socket.emit("mark_rejected", {
                                      id: contension._id,
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
                    })
                  ) : (
                    <h2>No contentions yet</h2>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
}