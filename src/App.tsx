import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const fetchData = async () => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=20");
    return response.data.results;
  } catch (error) {
    console.error(`Something went wrong while fetching user data ${error}`);
  }
};

// Function to flatten the location object for each user
const flattenUserDataLocationObject = (data) => {
  return data.map((user) => {
    const {
      location: {
        city,
        coordinates: { latitude, longitude },
        country,
        postcode,
        state,
        street: { number, name },
        timezone: { offset, description },
      },
    } = user;

    // Create a flattened version of location
    const flattenedLocation = {
      city,
      latitude,
      longitude,
      country,
      postcode,
      state,
      street_number: number,
      street_name: name,
      timezone_offset: offset,
      timezone_description: description,
    };

    // Return a new user object with the flattened location
    return {
      ...user,
      location: flattenedLocation,
    };
  });
};

const keys = [
  "city",
  "latitude",
  "longitude",
  "country",
  "postcode",
  "state",
  "street_number",
  "street_name",
  "timezone_offset",
  "timezone_description",
];
//next challenge, is to click on the header and it should change the order for me
//acending or descending
function App() {
  const [userData, setUserData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query

  // Sort data based on key and direction
  const handleSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    const sortedData = [...userData].sort((a, b) => {
      if (a.location[key] < b.location[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a.location[key] > b.location[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });

    setSortConfig({ key, direction });
    setUserData(sortedData);
  };

  // Handle input change for filtering
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  // Filter the userData based on the search query (for city or state)
  const filteredData = userData.filter((user) => {
    return keys.some((key) => {
      return user.location[key].toString().toLowerCase().includes(searchQuery);
    });
  });

  useEffect(() => {
    (async () => {
      const response = await fetchData();
      const flattenedData = flattenUserDataLocationObject(response);
      setUserData(flattenedData);
    })();
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Search by city or state..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <h2>User Locations</h2>
      <table border="" cellPadding="10">
        <thead>
          <tr>
            <th onClick={() => handleSort("city")}>
              City{" "}
              {sortConfig.key === "city"
                ? sortConfig.direction === "ascending"
                  ? "▲"
                  : "▼"
                : null}
            </th>
            <th onClick={() => handleSort("state")}>
              State{" "}
              {sortConfig.key === "state"
                ? sortConfig.direction === "ascending"
                  ? "▲"
                  : "▼"
                : null}
            </th>
            <th>Country</th>
            <th>Postcode</th>
            <th>Street</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Timezone Offset</th>
            <th>Timezone Description</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((user, index) => (
              <tr key={index}>
                <td>{user.location.city}</td>
                <td>{user.location.state}</td>
                <td>{user.location.country}</td>
                <td>{user.location.postcode}</td>
                <td>{`${user.location.street_number} ${user.location.street_name}`}</td>
                <td>{user.location.latitude}</td>
                <td>{user.location.longitude}</td>
                <td>{user.location.timezone_offset}</td>
                <td>{user.location.timezone_description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
