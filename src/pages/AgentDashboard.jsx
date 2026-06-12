import "./AgentDashboard.css";
import React, {
  useState,
  useEffect,
} from "react";

import {
  getAgentHotels,
  updateHotel,
  deleteHotel,
} from "../assets/services/hotelService";


const AgentDashboard = () => {
  const [hotelName, setHotelName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [address, setAddress] =
    useState("");

  
  const [
    description,
    setDescription,
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [image, setImage] =
    useState("");

  const [
    totalRooms,
    setTotalRooms,
  ] = useState("");

  const [myHotels, setMyHotels] =
    useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [isEditing, setIsEditing] =
    useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels =
    async () => {
      try {
        const agent =
          JSON.parse(
            localStorage.getItem(
              "agent"
            )
          );

        const response =
          await getAgentHotels(
            agent._id
          );

        setMyHotels(
          response.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const resetForm = () => {
    setHotelName("");
    setLocation("");
    setAddress("");
    setDescription("");
    setPrice("");
    setPhone("");
    setImage("");
    setTotalRooms("");

    setEditingId(null);
    setIsEditing(false);
  };

  const handleSubmit =
  async (e) => {
    e.preventDefault();

    try {
      const agent =
        JSON.parse(
          localStorage.getItem(
            "agent"
          )
        );

      console.log(
        "TOTAL ROOMS =",
        totalRooms
      );

      const hotelData = {
        hotelName,
        state: location,
        city: location,
        address,
        description,
        price,
        phone,
        image,

        totalRooms:
          Number(totalRooms),

        availableRooms:
          Number(totalRooms),

        agentId:
          agent._id,
      };

      console.log(
        "HOTEL DATA =",
        hotelData
      );

      if (
        isEditing
      ) {
        await updateHotel(
          editingId,
          hotelData
        );

        alert(
          "Hotel Updated Successfully"
        );
      } else {
        const response =
          await fetch(
            "http://localhost:5000/api/hotels",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body:
                JSON.stringify(
                  hotelData
                ),
            }
          );

        if (!response.ok) {
  const errorData =
    await response.json();

  console.log(
    "BACKEND ERROR =",
    errorData
  );

  alert(
    errorData.message
  );

  return;
}

        alert(
          "Hotel Added Successfully"
        );
      }

      resetForm();
      loadHotels();
    } catch (error) {
      console.log(error);

      alert(
        "Operation Failed"
      );
    }
  };

  const handleEdit = (
    hotel
  ) => {
    setHotelName(
      hotel.hotelName
    );

    setLocation(
      hotel.city
    );

    setAddress(
      hotel.address
    );

    setDescription(
      hotel.description
    );

    setPrice(
      hotel.price
    );

    setPhone(
      hotel.phone
    );

    setImage(
      hotel.image
    );

    setTotalRooms(
      hotel.totalRooms
    );

    setEditingId(
      hotel._id
    );

    setIsEditing(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
 
  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete this hotel?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        await deleteHotel(
          id
        );

        alert(
          "Hotel Deleted Successfully"
        );

        loadHotels();
      } catch (error) {
        console.log(error);

        alert(
          "Delete Failed"
        );
      }
    };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Agent Dashboard
      </h1>

      <h2>
        {isEditing
          ? "Update Hotel"
          : "Add Hotel"}
      </h2>

      <form
        className="hotel-form"
        onSubmit={
          handleSubmit
        }
      >
        <input
          type="text"
          placeholder="Hotel Name"
          value={hotelName}
          onChange={(e) =>
            setHotelName(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) =>
            setAddress(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <textarea
          placeholder="Description"
          value={
            description
          }
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Total Rooms"
          value={totalRooms}
          onChange={(e) =>
            setTotalRooms(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => {
            const value =
              e.target.value.replace(
                /\D/g,
                ""
              );

            setPhone(
              value
            );
          }}
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) =>
            setImage(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button
          type="submit"
        >
          {isEditing
            ? "Update Hotel"
            : "Add Hotel"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={
              resetForm
            }
            style={{
              marginLeft:
                "10px",
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>
        My Hotels
      </h2>

      {myHotels.length ===
      0 ? (
        <p>
          No Hotels Added
        </p>
      ) : (
        myHotels.map(
          (hotel) => (
            <div
              key={
                hotel._id
              }
              className="hotel-card"
              style={{
                border:
                  "1px solid #ddd",
                padding:
                  "15px",
                marginBottom:
                  "15px",
                borderRadius:
                  "10px",
              }}
            >
              <h3>
                {
                  hotel.hotelName
                }
              </h3>

              <p>
                📍{" "}
                {
                  hotel.city
                }
              </p>

              <p>
                ₹
                {
                  hotel.price
                }
                /night
              </p>

              <p>
                🏨 Total
                Rooms:{" "}
                {
                  hotel.totalRooms
                }
              </p>

              <p>
                ✅ Available:{" "}
                {
                  hotel.availableRooms
                }
              </p>

              <button
  onClick={() =>
    handleEdit(
      hotel
    )
  }
>
  Edit
</button>



<button
  onClick={() =>
    handleDelete(
      hotel._id
    )
  }
  style={{
    marginLeft:
      "10px",
  }}
>
  Delete
</button>
       <button
  onClick={() =>
    handleDelete(
      hotel._id
    )
  }
  style={{
    marginLeft:
      "10px",
  }}
>
  Delete
</button>
            </div>
          )
        )
      )}

    </div>
  );
};

export default AgentDashboard;
           

      
        

    