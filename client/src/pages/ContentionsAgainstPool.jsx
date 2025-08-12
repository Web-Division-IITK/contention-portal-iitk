import { getUserDetails } from "../utils/Login";

export function ContentionsAgainstMe({ feedbacks, socket }) {
  const userData = getUserDetails();

  console.log(userData)

  const contentionsAgainstMe = feedbacks;

  console.log(contentionsAgainstMe);

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
                    <strong>Problem:</strong> {contention.headline}
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
                  <small className="submission-time">
                    Submitted:{" "}
                    {new Date(
                      contention.createdAt || Date.now()
                    ).toLocaleDateString()}
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
