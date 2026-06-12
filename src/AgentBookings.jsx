import React, {
  useEffect,
  useState,
} from "react";

import {
  getAgentHotels,
} from "./assets/services/hotelService";

import {
  getHotelBookings,
} from "./assets/services/bookingService";

const AgentBookings = () => {
  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings =
    async () => {
      try {
        const agent =
          JSON.parse(
            localStorage.getItem(
              "agent"
            )
          );

        const hotels =
          await getAgentHotels(
            agent._id
          );

        let allBookings =
          [];

        for (
          const hotel of hotels.data
        ) {
          const response =
            await getHotelBookings(
              hotel._id
            );

          const bookingsWithHotel =
            response.data.map(
              (booking) => ({
                ...booking,
                hotelName:
                  hotel.hotelName,
              })
            );

          allBookings = [
            ...allBookings,
            ...bookingsWithHotel,
          ];
        }

        allBookings.sort(
          (a, b) =>
            new Date(
              a.checkIn
            ) -
            new Date(
              b.checkIn
            )
        );

        setBookings(
          allBookings
        );
      } catch (error) {
        console.log(error);
      }

      setLoading(false);
    };

  const groupedBookings =
    bookings.reduce(
      (
        groups,
        booking
      ) => {
        const date =
          new Date(
            booking.checkIn
          ).toLocaleDateString();

        if (
          !groups[date]
        ) {
          groups[date] = [];
        }

        groups[date].push(
          booking
        );

        return groups;
      },
      {}
    );

  if (loading) {
    return (
      <h2>
        Loading...
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        Agent Bookings
      </h1>

      {bookings.length ===
      0 ? (
        <p>
          No Bookings Found
        </p>
      ) : (
        Object.entries(
          groupedBookings
        ).map(
          ([
            date,
            bookingsForDate,
          ]) => (
            <div
              key={date}
              style={{
                marginBottom:
                  "30px",
              }}
            >
              <h2
                style={{
                  background:
                    "#f5f5f5",
                  padding:
                    "10px",
                  borderRadius:
                    "8px",
                }}
              >
                📅 {date}
              </h2>

              {bookingsForDate.map(
                (
                  booking
                ) => (
                  <div
                    key={
                      booking._id
                    }
                    style={{
                      border:
                        "1px solid #ddd",
                      borderRadius:
                        "10px",
                      padding:
                        "15px",
                      marginTop:
                        "10px",
                    }}
                  >
                    <h3>
                      🏨{" "}
                      {
                        booking.hotelName
                      }
                    </h3>

                    <p>
                      Check In:
                      {" "}
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      Check Out:
                      {" "}
                      {new Date(
                        booking.checkOut
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      Adults:
                      {" "}
                      {
                        booking.adults
                      }
                    </p>

                    <p>
                      Children:
                      {" "}
                      {
                        booking.children
                      }
                    </p>

                    <p>
                      Rooms:
                      {" "}
                      {
                        booking.rooms
                      }
                    </p>

                    <p>
                      Amount:
                      ₹
                      {
                        booking.totalAmount
                      }
                    </p>

                    <p>
                      Status:
                      {" "}
                      {
                        booking.status
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          )
        )
      )}
    </div>
  );
};

export default AgentBookings;