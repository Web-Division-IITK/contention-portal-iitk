import { getUserDetails } from "../utils/Login";
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { useState, useEffect } from "react";
import { clubPS, clubAdmins, SUPER_ADMIN } from "../../config/clubConfig.js";

export function Admin({ poolContention, socket }) {
  const [selectedPool, setSelectedPool] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedPS, setSelectedPS] = useState("all");
  const [userClub, setUserClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await getUserDetails();
        
        
        if (!userDetails) {
          console.error("No user details found");
          setUserClub(null);
          return;
        }

        if (!userDetails.email) {
          console.error("No email found in user details");
          setUserClub(null);
          return;
        }

        

        const club = clubAdmins[userDetails.email];
        

        if (!club) {
          console.error("User is not an admin of any club:", userDetails.email);
          setUserClub(null);
        } else {
          setUserClub(club);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserClub(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);


  const getProblemStatements = () => {
    const allPS = new Set(); // create a new set object to store unique problems
    // set ensures uniqueness of elements
    // If super admin, show all problem statements from all clubs
    if (userClub === SUPER_ADMIN) {
      Object.values(clubPS).forEach(problemStatements => {
        problemStatements.forEach(ps => allPS.add(ps));
      });
    }
    // If club admin, only show their club's problem statements
    else if (userClub && clubPS[userClub]) {
      clubPS[userClub].forEach(ps => allPS.add(ps));
    }
    // Fallback (shouldn't happen in normal flow)
    else {
      Object.values(poolContention).forEach(poolContentions => {
        if (!Array.isArray(poolContentions)) {
          return;
        }
        
        poolContentions.forEach(contention => {
          if (!contention || !contention.headline) {
            return;
          }
          allPS.add(contention.headline);
        });
      });
    }
    
    const sortedPS = Array.from(allPS).sort();
    return ["All Problem Statements", ...sortedPS];
  };

  const poolNames = Object.keys(poolContention).sort();

  useEffect(() => {
    if (selectedPool !== "all" && !poolNames.includes(selectedPool)) {
      setSelectedPool("all");
    }
  }, [poolContention, selectedPool, poolNames]);

  useEffect(() => {
    setSelectedPS("all");
  }, [poolContention]);

  const getFilteredPools = () => {
    let pools;         
    if (selectedPool === "all") {
      pools = poolContention;
    } else {
      pools = { [selectedPool]: poolContention[selectedPool] || [] };
    }
    const filtered = {};
   
    Object.keys(pools).forEach(poolName => {
      let contentions = pools[poolName] || [];
      
      
      if (userClub && clubPS[userClub]) {
        contentions = contentions.filter(contention => 
          clubPS[userClub].includes(contention.problemStatement)
        );
      }

      if (selectedPS !== "all") {
        contentions = contentions.filter(contention => 
          contention.problemStatement === selectedPS
        );
      }
      
      if (statusFilter === "pending") {
        contentions = contentions.filter(contention => contention.status === "pending");
      } else if (statusFilter === "reviewed") {
        contentions = contentions.filter(contention => 
          contention.status === "accepted" || contention.status === "rejected"
        );
      }
      
      filtered[poolName] = contentions;
    });
    return filtered;
  };

  const getStatusCounts = () => {
    let pending = 0;
    let reviewed = 0;
    let total = 0;

    const currentPools = selectedPool === "all" ? poolContention : { [selectedPool]: poolContention[selectedPool] || [] };
    
    Object.values(currentPools).forEach(contentions => {
      // Filter contentions based on admin type and club's problem statements
      const relevantContentions = userClub === SUPER_ADMIN 
        ? contentions
        : contentions.filter(contention => clubPS[userClub]?.includes(contention.problemStatement));

      relevantContentions.forEach(contention => {
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

  const FiltersContent = () => (
    <div className="filters-container" style={{
      display: "flex", 
      flexDirection: "row", 
      flexWrap: "wrap", 
      gap: "20px", 
      fontSize: "1rem"
    }}>
      
      <div className="pool-filter-nav" style={{ 
        flex: "1", 
        minWidth: "300px",
        alignItems:"flex-start", 
        justifyContent:"flex-start" 
      }}>
        <h3 className="pool-name-new" style={{  marginBottom: "10px" , textAlign: "center" }}>
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
              transition: "background-color 0.3s",
            }}
          >
            All Pools ({
              Object.values(poolContention).reduce((total, pool) => {
                if (userClub === SUPER_ADMIN) {
                  return total + pool.length;
                } else {
                  return total + pool.filter(contention => 
                    clubPS[userClub]?.includes(contention.problemStatement)
                  ).length;
                }
              }, 0)
            })
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
              {pool} ({
                userClub === SUPER_ADMIN 
                  ? poolContention[pool]?.length || 0
                  : poolContention[pool]?.filter(contention => 
                      clubPS[userClub]?.includes(contention.headline)
                    ).length || 0
              })
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
        <h3 className="pool-name-new" style={{ marginBottom: "10px", textAlign: "center",  }}>
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

      <div className="filter-section">
        <h3 className="pool-name-new" style={{ marginBottom: "10px", textAlign: "center" }}>
          Filter by Problem Statement
        </h3>
        <select
          value={selectedPS}
          onChange={(e) => setSelectedPS(e.target.value)}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #6c757d",
            backgroundColor: "#f8f9fa",
            width: "100%",
            maxWidth: "300px",
            marginBottom: "20px",
            color:"black",
          }}
          className="btn btn-secondary dropdown-toggle"
        >
          {getProblemStatements().map((ps) => (
            <option key={ps} value={ps === "All Problem Statements" ? "all" : ps}>
              {ps}
            </option>
          ))}
        </select>
      </div>

    </div>
  );

  return (
    <>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Loading...</h2>
        </div>
      ) : !userClub ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>Access Denied</h2>
          <p>You do not have admin access to any club.</p>
          <p style={{ color: 'gray', fontSize: '0.9em' }}>Please contact the system administrator if you believe this is an error.</p>
          <p style={{ color: 'gray', fontSize: '0.8em' }}>Technical details: Please ensure your email is registered as a club admin.</p>
        </div>
      ) : (
        <div className="container" id="welcome"  style={{borderRadius:"6px", marginTop:"10px"}}>
          <div className="welcome-message" style={{ textAlign: "center", padding: "20px", backgroundColor: "#000000ff",  marginBottom: "20px", color:"white" ,borderRight:"2px solid #7f7fff",borderTop:"2px solid #7f7fff",borderBottom:"2px solid #7f7fff", borderLeft:"6px solid #7f7fff", borderRadius:"6px"}}>
            <h2>Welcome, {userClub === SUPER_ADMIN ? "Super Admin" : `${userClub} Admin`}</h2>
            <p>
              {userClub === SUPER_ADMIN 
                ? "You have access to manage contentions for all clubs and problem statements." 
                : "You can view and manage contentions related to your club's problem statements."}
            </p>
          </div>
          
          <FiltersContent />

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
              <div key={pool} style={{alignItems:"center", justifyContent:"center", justifyItems:"center"}}>
                <h1 className="pool-name" style={{ alignItems:"center", justifyContent:"center"}}>{pool}</h1>
                <hr style={{ border: "1px solid #7f7fff", opacity:"1", width:"100%"}}/>
                <div className="pool-section">
                  {sortedContentions.map((contention) => {
                    return (
                      <div className="feedback-card" style={{borderBottom:"1px solid #7f7fff",borderLeft:"5px solid #7f7fff", borderTop:"1px solid #7f7fff", borderRight:"1px solid #7f7fff"}} id="feedback-card1" key={`${contention._id}-${pool}`}>
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
                                  if(window.confirm(`✅ Are you sure you want to accept this contention?\n\nPool: ${contention.pool}\nAgainst: ${contention.againstPool}\nProblem: ${contention.problemStatement}`))
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
                                  if(window.confirm(`❌ Are you sure you want to reject this contention?\n\nPool: ${contention.pool}\nAgainst: ${contention.againstPool}\nProblem: ${contention.problemStatement}`))
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
      )}
    </>
  );
}



