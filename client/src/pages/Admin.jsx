import { getUserDetails } from "../utils/Login";

export function Admin({ poolContension, socket }) {
  const userData = getUserDetails();

  // console.log(123456, poolContension.keys());

  return (
    <>
      <div className="container">
        <h2 style={{ color: "white", marginBottom: "20px" }}>
          All Contentions
        </h2>
        {Object.keys(poolContension)
          .sort()
          .map((pool) => {
            let contensions = poolContension[pool];
            return (
              <>
                <div>
                  <h1>{pool}:</h1>
                  {contensions.length > 0 ? (
                    contensions.map((contension) => {
                      return (
                        <div className="feedback-card" key={contension._id}>
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
                              ).toLocaleDateString()}
                            </small>

                            <button
                              className="toggle-btn"
                              onClick={() => {
                                socket.emit("change_status", {
                                  id: contension._id,
                                  status:
                                    contension.status === "pending"
                                      ? "reviewed"
                                      : "pending",
                                });
                              }}
                            >
                              Toggle Review
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <h2>No contentions yet</h2>
                  )}
                </div>
              </>
            );
          })}
      </div>
    </>
  );
}
