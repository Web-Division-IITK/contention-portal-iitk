import { getUserDetails } from "../utils/Login";
import { VscCheck, VscChromeClose } from "react-icons/vsc";

export function Admin({ poolContension, socket }) {
  const userData = getUserDetails();

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
                <div className="pool-section" key={pool}>
                  <h1>{pool}:</h1>
                  {contensions.length > 0 ? (
                    contensions.map((contension) => {
                      return (
                        <div className="feedback-card" key={`${contension._id}-${pool}`}>
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
              </>
            );
          })}
      </div>
    </>
  );
}
