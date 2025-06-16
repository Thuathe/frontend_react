import { useEffect, useState } from "react";

function App() {
  const [buku, setBuku] = useState([]);
  const [judul, setJudul] = useState("");
  const [penulis, setPenulis] = useState("");
  const [editId, setEditId] = useState(null);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);

  // Ganti dengan URL backend Railway kamu
  const baseUrl = "https://backendlaravel-production-c9b5.up.railway.app";

  const fetchData = () => {
    fetch(`${baseUrl}/api/buku`)
      .then((res) => res.json())
      .then((data) => setBuku(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("judul", judul);
    formData.append("penulis", penulis);
    if (cover) {
      formData.append("cover", cover);
    }

    const isEdit = !!editId;
    const url = isEdit
      ? `${baseUrl}/api/buku/${editId}`
      : `${baseUrl}/api/buku`;

    if (isEdit) {
      formData.append("_method", "PUT");
    }

    fetch(url, {
      method: "POST", // tetap POST agar bisa upload file
      body: formData,
    }).then(() => {
      setJudul("");
      setPenulis("");
      setCover(null);
      setPreview(null);
      setEditId(null);
      fetchData();
    });
  };

  const handleEdit = (b) => {
    setEditId(b.id);
    setJudul(b.judul);
    setPenulis(b.penulis);
    setCover(null); // Kosongkan file input
    if (b.cover) {
      setPreview(`${baseUrl}/storage/${b.cover}`);
    } else {
      setPreview(null);
    }
  };

  const handleDelete = (id) => {
    fetch(`${baseUrl}/api/buku/${id}`, {
      method: "DELETE",
    }).then(() => fetchData());
  };
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const buttonStyle = {
  background: "#4caf50",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};

  return (
<div style={{ padding: 24, maxWidth: 500, margin: "0 auto", fontFamily: "sans-serif" }}>
  <h1 style={{ textAlign: "center", color: "#fff" }}>📚 Daftar Buku</h1>

  <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ marginBottom: 32 }}>
    <input
      type="text"
      placeholder="Judul"
      value={judul}
      onChange={(e) => setJudul(e.target.value)}
      required
      style={inputStyle}
    />
    <input
      type="text"
      placeholder="Penulis"
      value={penulis}
      onChange={(e) => setPenulis(e.target.value)}
      required
      style={inputStyle}
    />
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        setCover(e.target.files[0]);
        setPreview(URL.createObjectURL(e.target.files[0]));
      }}
      style={{ marginBottom: 10 }}
    />
    {preview && (
      <img
        src={preview}
        alt="Preview"
        width="100"
        style={{ display: "block", marginBottom: 10, borderRadius: 6 }}
      />
    )}
    <button type="submit" style={buttonStyle}>
      {editId ? "Update" : "Tambah"}
    </button>
  </form>

  <div>
    {buku.map((b) => (
      <div
        key={b.id}
        style={{
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 16,
          background: "grey",
        }}
      >
        {b.cover && (
          <img
            src={`${baseUrl}/storage/${b.cover}`}
            alt="cover"
            width="80"
            style={{ borderRadius: 5, marginBottom: 10 }}
          />
        )}
        <div style={{ fontWeight: "bold", fontSize: 16 }}>{b.judul}</div>
        <div style={{  marginBottom: 8 }}>{b.penulis}</div>
        <button onClick={() => handleEdit(b)} style={{ ...buttonStyle, marginRight: 8, background: "#1976d2" }}>
          Edit
        </button>
        <button onClick={() => handleDelete(b.id)} style={{ ...buttonStyle, background: "#d32f2f" }}>
          Hapus
        </button>
      </div>
    ))}
  </div>
</div>

  );
}

export default App;
