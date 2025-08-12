import { getUserDetails } from "../utils/Login";

export function MyContentions({ feedbacks }) {
  const userData = getUserDetails();

  const myContentions = feedbacks;

  console.log(myContentions);

  return (
    <div className="contentions-section">
      <h3 style={{ color: "white", marginBottom: "20px" }}>
        My Submitted Contentions ({myContentions.length})
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
                    <strong>Against:</strong> {contention.againstPool}
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
