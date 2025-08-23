export function MyContentions({ feedbacks }) {
  const myContentions = feedbacks;

  return (
    <div className="contentions-section">
      <h3 style={{ color: "white", marginBottom: "20px" }}>
        My Submitted Contentions ({myContentions.length || 0})
      </h3>

      {myContentions.length > 0 ? (
        <div className="contentions-grid">
          {myContentions.map((contention) => (
            <div className="feedback-card my-contention" key={contention._id}>
              <div className="feedback-header">
                <span className={`status ${contention.status}`}>
                  {contention.status}
                </span>
                <div className="contention-details">
                  <p>
                    <strong>From:</strong> {contention.pool}
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
                    ).toLocaleDateString("en-us", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {contention.createdAt &&
                      Date.now() - new Date(contention.createdAt).getTime() <
                        30 * 60 * 1000 && (
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
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-contentions">
          <p style={{ color: "#ccc", textAlign: "center", padding: "20px" }}>
            You haven't submitted any contentions yet.
          </p>
        </div>
      )}
    </div>
  );
}
