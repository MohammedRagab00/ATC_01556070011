import { useState, useEffect } from "react";
import styled from "styled-components";
import { useSidebar } from "../context/SidebarContext";
import { Layout, Pagination } from "antd";

const Container = styled.div`
  padding: 32px 24px;
  margin-left: ${({ $collapsed }) => ($collapsed ? "80px" : "200px")};
  transition: all 0.3s ease;
  min-height: 100vh;
  width: auto;
  background: #f5f5f5;
`;

const EventList = () => {
  const { collapsed } = useSidebar();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // Add pagination state
  const [pagination, setPagination] = useState({
    current: 0,
    pageSize: 9,
    total: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (page = pagination.current) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://epic-gather-dua2cncsh4g5gxg8.uaenorth-01.azurewebsites.net/api/v1/event?page=${page}&size=${pagination.pageSize}`
      );

      if (!response.ok) throw new Error("Failed to fetch events");
      const data = await response.json();
      setEvents(data.content || []);
      setPagination((prev) => ({
        ...prev,
        current: page,
        total: data.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchEvents(page - 1); // API uses 0-based indexing
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Container $collapsed={collapsed}>
        <h2 className="text-xl font-semibold mb-5">Events</h2>
        <div className="bg-white rounded-lg shadow p-5">
          {loading ? (
            <p className="text-gray-600">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600">No events available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                    <p className="text-gray-600 mb-2">{event.venue}</p>
                    <p className="text-gray-800 font-medium">
                      ${event.price.toFixed(2)}
                    </p>
                    <p className="text-gray-600 mb-2">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                    {event.tags?.length > 0 && (
                      <div className="mt-2">
                        {event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "24px",
          }}
        >
          <Pagination
            current={pagination.current + 1}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default EventList;
