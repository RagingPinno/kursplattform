// src/PackageDetail.jsx
import axios from "axios";
import { useEffect, useState } from "react";

function PackageDetail({ packageId }) {
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    axios.get(`/api/packages/${packageId}`)
      .then(res => setPkg(res.data))
      .catch(err => console.error("Fel vid hämtning av paket", err));
  }, [packageId]);

  if (!pkg) return <p>Laddar paket...</p>;

  return (
    <div>
      <h2>{pkg.title}</h2>
      <p><strong>Syfte:</strong> {pkg.purpose}</p>
      <h3>Kurser i paketet</h3>
      {pkg.courses.map(course => (
        <div key={course._id}>
          <h4>{course.title}</h4>
          <p>{course.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PackageDetail;
