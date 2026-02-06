import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserProvider";

export default function UserManagement() {
  const { user } = useUser();
  const API_URL = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  async function fetchUsers(p = page) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/user?page=${p}&limit=10`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function startEdit(u) {
    setEditingId(u._id);
    setEditForm({
      username: u.username || "",
      email: u.email || "",
      firstname: u.firstname || "",
      lastname: u.lastname || "",
      status: u.status || "ACTIVE",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
  }

  async function saveEdit(id) {
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Update failed (${res.status})`);
      }
      setEditingId(null);
      setEditForm({});
      await fetchUsers(page);
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteUser(id, email) {
    if (!window.confirm(`Delete user "${email}"?`)) return;
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/user/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Delete failed (${res.status})`);
      }
      await fetchUsers(page);
    } catch (err) {
      setError(err.message);
    }
  }

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "12px",
    fontSize: "14px",
  };
  const thTdStyle = {
    border: "1px solid #ccc",
    padding: "6px 10px",
    textAlign: "left",
  };
  const btnStyle = {
    margin: "0 3px",
    padding: "4px 10px",
    cursor: "pointer",
    border: "1px solid #888",
    borderRadius: "3px",
    background: "#f5f5f5",
  };
  const inputStyle = {
    padding: "3px 6px",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ padding: "20px", maxWidth: "960px", margin: "0 auto" }}>
      <h2>User Management</h2>
      <p>Total users: {total}</p>

      {error && (
        <div style={{ color: "red", marginBottom: "8px" }}>Error: {error}</div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thTdStyle}>#</th>
                <th style={thTdStyle}>Username</th>
                <th style={thTdStyle}>Email</th>
                <th style={thTdStyle}>First Name</th>
                <th style={thTdStyle}>Last Name</th>
                <th style={thTdStyle}>Status</th>
                <th style={thTdStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u._id}>
                  <td style={thTdStyle}>{(page - 1) * 10 + idx + 1}</td>

                  {editingId === u._id ? (
                    <>
                      <td style={thTdStyle}>
                        <input
                          style={inputStyle}
                          value={editForm.username}
                          onChange={(e) =>
                            setEditForm({ ...editForm, username: e.target.value })
                          }
                        />
                      </td>
                      <td style={thTdStyle}>
                        <input
                          style={inputStyle}
                          value={editForm.email}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                        />
                      </td>
                      <td style={thTdStyle}>
                        <input
                          style={inputStyle}
                          value={editForm.firstname}
                          onChange={(e) =>
                            setEditForm({ ...editForm, firstname: e.target.value })
                          }
                        />
                      </td>
                      <td style={thTdStyle}>
                        <input
                          style={inputStyle}
                          value={editForm.lastname}
                          onChange={(e) =>
                            setEditForm({ ...editForm, lastname: e.target.value })
                          }
                        />
                      </td>
                      <td style={thTdStyle}>
                        <select
                          style={inputStyle}
                          value={editForm.status}
                          onChange={(e) =>
                            setEditForm({ ...editForm, status: e.target.value })
                          }
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                        </select>
                      </td>
                      <td style={thTdStyle}>
                        <button style={btnStyle} onClick={() => saveEdit(u._id)}>
                          Save
                        </button>
                        <button style={btnStyle} onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={thTdStyle}>{u.username}</td>
                      <td style={thTdStyle}>{u.email}</td>
                      <td style={thTdStyle}>{u.firstname}</td>
                      <td style={thTdStyle}>{u.lastname}</td>
                      <td style={thTdStyle}>{u.status}</td>
                      <td style={thTdStyle}>
                        <button style={btnStyle} onClick={() => startEdit(u)}>
                          Edit
                        </button>
                        <button
                          style={{ ...btnStyle, background: "#fee" }}
                          onClick={() => deleteUser(u._id, u.email)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...thTdStyle, textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: "12px" }}>
            <button
              style={btnStyle}
              disabled={page <= 1}
              onClick={() => fetchUsers(page - 1)}
            >
              Previous
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {page} of {totalPages}
            </span>
            <button
              style={btnStyle}
              disabled={page >= totalPages}
              onClick={() => fetchUsers(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
