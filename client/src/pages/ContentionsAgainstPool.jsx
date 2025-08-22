import { getUserDetails } from "../utils/Login";

export function ContentionsAgainstMe({ feedbacks, socket }) {
  const userData = getUserDetails();

  const contentionsAgainstMe = feedbacks;

  return (
    <div className="contentions-section">
      <h3 style={{ color: "white", marginBottom: "20px" }}>
        Contentions Against My Pool ({contentionsAgainstMe.length})
      </h3>

      {contentionsAgainstMe.length > 0 ? (
        <div className="contentions-grid">
          {contentionsAgainstMe.map((contention) => (
            <div
              className="feedback-card against-me-contention"
              key={contention._id}
            >
              <div className="feedback-header">
                <span className={`status ${contention.status}`}>
                  {contention.status}
                </span>
                <div className="contention-details">
                  <p>
                    <strong>From:</strong> {contention.pool}
                  </p>
                  <p>
                    <strong>Against:</strong> {contention.againstPool} (Your
                    Pool)
                  </p>
                  <p>
                    <strong>Problem:</strong> {contention.problemStatement}
                  </p>
                  {contention.description && (
                    <p>
                      <strong>Description:</strong> {contention.description}
                    </p>
                  )}
                  {contention.drive && (
                    <p>
                      <strong>drive:</strong>{" "}
                      <a
                        href={contention.drive}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {contention.drive}
                      </a>
                    </p>
                  )}
                  {/* <small className="submission-time">
                    Submitted:{" "}
                    {new Date(
                      contention.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </small> */}

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
                               (Date.now() - new Date(contention.createdAt).getTime()) < 30 * 60 * 1000 && (
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
                </div>

                {userData.role === "admin" && (
                  <button
                    className="toggle-btn"
                    onClick={() => {
                      socket.emit("change_status", {
                        id: contention._id,
                        status:
                          contention.status === "pending"
                            ? "reviewed"
                            : "pending",
                      });
                    }}
                  >
                    Toggle Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-contentions">
          <p style={{ color: "#ccc", textAlign: "center", padding: "20px" }}>
            No contentions have been submitted against your pool yet.
          </p>
        </div>
      )}
    </div>
  );
}
