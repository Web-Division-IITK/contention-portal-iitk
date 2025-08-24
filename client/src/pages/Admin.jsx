import { getClubPS, getUserDetails } from "../utils/Login";
import { VscCheck, VscChromeClose } from "react-icons/vsc";
import { useState, useEffect } from "react";
import * as config from "../../config/config";

export function Admin({ poolContention, socket }) {
  const [selectedPool, setSelectedPool] = useState("all");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [selectedPS, setSelectedPS] = useState("all");
  const [PS, setPS] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const user = getUserDetails();

      if (!user) return;
      let role = "user";
      if (user.club === "sntsecy") role = "sntsecy";
      else if (user.role === "admin") role = "admin";
      setUserRole(role);
      let allPS = [];
      if (role === "sntsecy") {
        // get problem statements for all clubs
        for (const club of config.clubs) {
          try {
            const res = await getClubPS(club);
            allPS = [...allPS, ...res.data];
          } catch (err) {
            console.error(`Failed to fetch PS for club ${club}:`, err);
          }
        }
        setPS([{ title: "all" }, ...allPS]);
      } else {
        // Normal club admin
        const res = await getClubPS(user.club);
        setPS([{ title: "all" }, ...res.data]);
      }
    }

    fetchUserData();
  }, []);

  const getFilteredPools = () => {
    let pools;
    if (selectedPool === "all") {
      pools = poolContention;
    } else {
      pools = { [selectedPool]: poolContention[selectedPool] || [] };
    }
    const filtered = {};

    Object.keys(pools).forEach((poolName) => {
      let contentions = pools[poolName] || [];

      if (selectedPS !== "all") {
        contentions = contentions.filter(
          (contention) => contention.problemStatement === selectedPS
        );
      }

      if (statusFilter === "pending") {
        contentions = contentions.filter(
          (contention) => contention.status === "pending"
        );
      } else if (statusFilter === "reviewed") {
        contentions = contentions.filter(
          (contention) =>
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

    const currentPools =
      selectedPool === "all"
        ? poolContention
        : { [selectedPool]: poolContention[selectedPool] || [] };

    Object.values(currentPools).forEach((contentions) => {
      // Filter contentions based on admin type and club's problem statements
      const relevantContentions = contentions.filter(
        (contention) =>
          selectedPS === "all" || contention.problemStatement === selectedPS
      );

      relevantContentions.forEach((contention) => {
        total++;
        if (contention.status === "pending") {
          pending++;
        } else if (
          contention.status === "accepted" ||
          contention.status === "rejected"
        ) {
          reviewed++;
        }
      });
    });

    return { pending, reviewed, total };
  };

  const filteredPools = getFilteredPools();
  const statusCounts = getStatusCounts();

  const FiltersContent = () => (
    <div
      className="filters-container"
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "20px",
        fontSize: "1rem",
      }}
    >
      <div
        className="pool-filter-nav"
        style={{
          flex: "1",
          minWidth: "300px",
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <h3
          className="pool-name-new"
          style={{ marginBottom: "10px", textAlign: "center" }}
        >
          Filter by Pool
        </h3>

        <div
          className="pool-filter-buttons"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <button
            className={`pool-filter-btn ${
              selectedPool === "all" ? "active" : ""
            }`}
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
            All Pools (
            {Object.values(poolContention).reduce((total, pool) => {
              return total + pool.length;
            }, 0)}
            )
          </button>
          {config.pools.map((pool) => (
            <button
              key={pool}
              className={`pool-filter-btn ${
                selectedPool === pool ? "active" : ""
              }`}
              onClick={() => setSelectedPool(pool)}
              style={{
                padding: "8px 16px",
                backgroundColor: selectedPool === pool ? "#7f7fff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
            >
              {pool} ({poolContention[pool]?.length || 0})
            </button>
          ))}
        </div>
      </div>

      <div
        className="status-filter-nav"
        style={{
          flex: "0 0 auto",
          minWidth: "300px",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <h3
          className="pool-name-new"
          style={{ marginBottom: "10px", textAlign: "center" }}
        >
          Filter by Status
        </h3>

        <div
          className="status-filter-buttons"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <button
            className={`status-filter-btn ${
              statusFilter === "pending" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
            style={{
              padding: "8px 16px",
              backgroundColor:
                statusFilter === "pending" ? "#ffc107" : "#6c757d",
              color: statusFilter === "pending" ? "#000" : "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Pending ({statusCounts.pending})
          </button>
          <button
            className={`status-filter-btn ${
              statusFilter === "reviewed" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("reviewed")}
            style={{
              padding: "8px 16px",
              backgroundColor:
                statusFilter === "reviewed" ? "#28a745" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            Reviewed ({statusCounts.reviewed})
          </button>
          <button
            className={`status-filter-btn ${
              statusFilter === "all" ? "active" : ""
            }`}
            onClick={() => setStatusFilter("all")}
            style={{
              padding: "8px 16px",
              backgroundColor: statusFilter === "all" ? "#7f7fff" : "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          >
            All Status ({statusCounts.total})
          </button>
        </div>
      </div>

      <div className="filter-section" style={{}}>
        <h3
          className="pool-name-new"
          style={{ marginBottom: "10px", textAlign: "center" }}
        >
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
            //backgroundColor: "#f8f9fa",
            width: "100%",
            maxWidth: "300px",
            marginBottom: "20px",
            backgroundColor: "black",
            color: "white",
          }}
          className="btn btn-secondary dropdown-toggle"
        >
          {PS &&
            PS.map((ps, i) => (
              <option
                key={i}
                value={ps.title === "All Problem Statements" ? "all" : ps.title}
                style={{ backgroundColor: "black", color: "white" }}
              >
                {ps.title}
              </option>
            ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      {
        <div
          className="container"
          id="welcome"
          style={{
            padding: "20px",
            margin: "24px auto",

            boxSizing: "border-box",
          }}
        >
          <FiltersContent />

          <hr
            style={{
              border: "1px solid #7f7fff",
              opacity: "1",
              width: "100%",
              marginBottom: "20px",
            }}
          />

          {Object.keys(filteredPools)
            .sort()
            .map((pool) => {
              console.log(filteredPools)
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
                <div
                  key={pool}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    justifyItems: "center",
                  }}
                >
                  <h1
                    className="pool-name"
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    {pool}
                  </h1>
                  <hr
                    style={{
                      border: "1px solid #7f7fff",
                      opacity: "1",
                      width: "100%",
                    }}
                  />
                  <div className="pool-section">
                    {sortedContentions.map((contention) => {
                      return (
                        <div
                          className="contention-card"
                          style={{
                            borderBottom: "1px solid #7f7fff",
                            borderLeft: "5px solid #7f7fff",
                            borderTop: "1px solid #7f7fff",
                            borderRight: "1px solid #7f7fff",
                            margin: "10px 0",
                          }}
                          id="contention-card"
                          key={`${contention._id}-${pool}`}
                        >
                          <div className="contention-header">
                            <p>
                              <strong>From:</strong> {contention.pool}
                            </p>
                            <p>
                              <strong>Problem:</strong>{" "}
                              {contention.problemStatement}
                            </p>
                            {contention.description && (
                              <p>
                                <strong>Description:</strong>{" "}
                                {contention.description}
                              </p>
                            )}
                            {typeof contention.drive === "string" &&
                              contention.drive.trim() !== "" && (
                                <p>
                                  <strong>Drive Link:</strong>{" "}
                                  <a
                                    href={contention.drive}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color: "#7f7fff",
                                      textDecoration: "underline",
                                      wordBreak: "break-all",
                                      overflowWrap: "break-word",
                                    }}
                                  >
                                    {contention.drive}
                                  </a>
                                </p>
                              )}

                            <small className="submission-time">
                              Submitted:{" "}
                              {new Date(
                                contention.createdAt || Date.now()
                              ).toLocaleDateString("en-us", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {contention.createdAt &&
                                Date.now() -
                                  new Date(contention.createdAt).getTime() <
                                  1 * 60 * 1000 && (
                                  <span
                                    style={{
                                      marginLeft: "10px",
                                      backgroundColor: "#ff4757",
                                      color: "white",
                                      padding: "2px 6px",
                                      borderRadius: "3px",
                                      fontSize: "10px",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    NEW
                                  </span>
                                )}
                            </small>
                            <div className="status-actions">
                              <span className={`status ${contention.status}`}>
                                {contention.status}
                              </span>
                              <div className="toggle-buttons-box">
                                {/* Accept button — show only if not accepted */}
                                {contention.status !== "accepted" && (
                                  <button
                                    className="toggle-btn"
                                    style={{ backgroundColor: "green" }}
                                    title="Accept contention"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `✅ Are you sure you want to accept this contention?\n\nPool: ${contention.pool}\nProblem: ${contention.problemStatement}`
                                        )
                                      ) {
                                        socket.emit("mark_accepted", {
                                          id: contention._id,
                                        });
                                      }
                                    }}
                                  >
                                    <VscCheck />
                                  </button>
                                )}

                                {/* Reject button — show only if not rejected */}
                                {contention.status !== "rejected" && (
                                  <button
                                    className="toggle-btn"
                                    style={{ backgroundColor: "red" }}
                                    title="Reject contention"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `❌ Are you sure you want to reject this contention?\n\nPool: ${contention.pool}\nProblem: ${contention.problemStatement}`
                                        )
                                      ) {
                                        socket.emit("mark_rejected", {
                                          id: contention._id,
                                        });
                                      }
                                    }}
                                  >
                                    <VscChromeClose />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {Object.keys(filteredPools).every(
            (pool) => filteredPools[pool].length === 0
          ) && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <h2>No contentions found for the selected filters</h2>
              <p>Try changing the filters to see more results.</p>
            </div>
          )}
        </div>
      }
    </>
  );
}
