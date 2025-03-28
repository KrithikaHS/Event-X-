import React, { useEffect, useRef, useState } from "react";
import "./App.css"; //CSS


function App() {
  
  const [events, setEvents] = useState(() => {
    const storedEvents = localStorage.getItem("events");
    return storedEvents ? JSON.parse(storedEvents) : [];
  });

  const [registeredEvents, setRegisteredEvents] = useState(() => {
    const storedRegistered = localStorage.getItem("registeredEvents");
    return storedRegistered ? JSON.parse(storedRegistered) : [];
  });

  const [eventData, setEventData] = useState({
    name: "",
    date: "",
    description: "",
    venue: "",
    image: null,
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [editingIndex, setEditingIndex] = useState(null); // edits

  

const handleEventClick = (event, eventData) => {
  setSelectedEvent(eventData);

  setTimeout(() => {
    if (registerButtonRef.current) {
      registerButtonRef.current.focus();
    }
  }, 100); 
};

useEffect(() => {
  if (selectedEvent) {
    window.scrollTo({
      top: window.innerHeight / 20, 
      behavior: "smooth"
    });
  }
}, [selectedEvent]);



  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
  if (file) {
    setEventData({ ...eventData, image: URL.createObjectURL(file) });
  }
};
const handleSubmit = (e) => {
  e.preventDefault();
  
  if (!eventData.name || !eventData.date || !eventData.description || !eventData.venue) {
    alert("Please fill all fields (image is required for new events)!");
    return;
  }

 



  let updatedEvents;
  const isDuplicate = events.some((event, index) =>
    event.name === eventData.name && event.date === eventData.date && index !== editingIndex
  );

  if (isDuplicate) {
    alert("An event with the same name and date already exists!");
    return;
  }
  if (editingIndex !== null) {
  const updatedEvent = { 
    ...eventData, 
    image: eventData.image || events[editingIndex].image 
  };

  updatedEvents = events.map((event, index) => (index === editingIndex ? updatedEvent : event));

  const updatedRegistered = registeredEvents.map((event) =>
    event.name === events[editingIndex].name ? updatedEvent : event
  );

    setRegisteredEvents(updatedRegistered);
    localStorage.setItem("registeredEvents", JSON.stringify(updatedRegistered));
    
    setEditingIndex(null);
  }  else {
    
    if (!eventData.image) {
      alert("Please upload an image for the event!");
      return;
    }
    updatedEvents = [...events, eventData];
  }

  setEvents(updatedEvents);
  localStorage.setItem("events", JSON.stringify(updatedEvents)); // Store in localStorage
  setEventData({ name: "", date: "", description: "", venue: "", image: null });
};

  const nameInputRef = useRef(null);

  const handleEdit = (index) => {
    setEventData(events[index]); 
    setEditingIndex(index);
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 100);
  };
  const handleDelete = (index) => {
    const deletedEvent = events[index]; 
  
    
    const updatedEvents = events.filter((_, i) => i !== index);
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
  
    
    const updatedRegistered = registeredEvents.filter(event => event.name !== deletedEvent.name);
    setRegisteredEvents(updatedRegistered);
    localStorage.setItem("registeredEvents", JSON.stringify(updatedRegistered));
  };
  

  const handleRegister = (event) => {
    if (!registeredEvents.find((e) => e.name === event.name)) {
      const updatedRegistered = [...registeredEvents, event];
      setRegisteredEvents(updatedRegistered);
      localStorage.setItem("registeredEvents", JSON.stringify(updatedRegistered));
    }
    setSelectedEvent(null);
  };
 
  const handleUnregister = (eventName) => {
    const updatedRegistered = registeredEvents.filter((event) => event.name !== eventName);
    setRegisteredEvents(updatedRegistered);
    localStorage.setItem("registeredEvents", JSON.stringify(updatedRegistered));
    setSelectedEvent(null)
  };

  const isRegistered = (event) => registeredEvents.some((e) => e.name === event.name);
  const registerButtonRef = useRef(null);
  useEffect(() => {
    if (selectedEvent && registerButtonRef.current) {
      registerButtonRef.current.focus(); 
    }
  }, [selectedEvent]);
  return (
    <div className="screen">
      <h1 className="head">Event Registration System</h1>

      
      {selectedEvent && <div className="overlay"></div>}

      <div className={`container ${selectedEvent ? "disabled" : ""}`}>
    
        {selectedEvent && (
  <div className="event-popup">
    <h2>{selectedEvent.name}</h2>
    <img src={selectedEvent.image} alt={selectedEvent.name} />
    <p><strong>Date:</strong> {selectedEvent.date}</p>
    <p><strong>Venue:</strong> {selectedEvent.venue}</p>
    <p>{selectedEvent.description}</p>
    
    {isRegistered(selectedEvent) ? (
      <>
        <button className="register-btn" disabled>Already Registered</button>
        <button className="unregister-btn" onClick={() => handleUnregister(selectedEvent.name)}>Unregister</button>
      </>
    ) : (
      <button 
  ref={registerButtonRef} 
  className="register-btn" 
  onClick={() => handleRegister(selectedEvent)}
>
  Register
</button>

    )}
    
    <button className="close-btn" onClick={() => setSelectedEvent(null)}>Close</button>
  </div>
)}

        
        <div className="left">
          
       
        <div className="create">
          <h2>{editingIndex !== null ? "Edit Event" : "Create Event"}</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" name="name" placeholder="Event Name" value={eventData.name} onChange={handleChange} required ref={nameInputRef}/>
            <input type="date" name="date" min={getTomorrowDate()} value={eventData.date} onChange={handleChange} required />
            <textarea name="description" placeholder="Event Description" value={eventData.description} onChange={handleChange} required></textarea>
            <input type="text" name="venue" placeholder="Event Venue" value={eventData.venue} onChange={handleChange} required />
            {eventData.image && (
  <div>
    <p class="curr">Current Poster:</p>
    <img src={eventData.image} alt="Event" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
  </div>
)}
            <label>Poster:
            <input type="file" accept="image/*"  onChange={handleImageUpload}  /></label>
            <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit">{editingIndex !== null ? "Update Event" : "Add Event"}</button>
            {editingIndex !== null && (
      <button type="button" className="cancel-btn" onClick={() => {
        setEditingIndex(null);
        setEventData({ name: "", date: "", description: "", venue: "", image: null });
      }}>Cancel Edit</button>
    )}
  </div>
          </form>
          
        </div>

      
<div className="your-events">
  <h2>Your Created Events</h2>
  {events.length === 0 ? <p>No events created yet</p> : null}
  <div className="created-events-grid">
    {events.map((event, index) => (
      <div key={index} className="event-card-small">
        <h3>{event.name}</h3>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p>{event.description.length > 50 ? event.description.substring(0, 50) + "..." : event.description}</p>
        <div className="event-actions">
          <button onClick={() => handleEdit(index)} className="edit-btn">Edit</button>
          <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
        </div>
      </div>
    ))}
  </div>
</div>


  
    <div className="registered-events">
            <h2>Registered Events</h2>
            {registeredEvents.length === 0 ? <p>No registered events</p> : null}
            <div className="created-events-grid">
              {registeredEvents.map((event, index) => (
                <div key={index} className="event-card-small">
                  <h3>{event.name}</h3>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Venue:</strong> {event.venue}</p>
                  <button className="unregister-btn" onClick={() => handleUnregister(event.name)}>Unregister</button>
                </div>
              ))}
            </div>
          </div>
        
        
        
        </div>

            
       
        <div className="right">
        <div className="upcoming">
          <h2 className="up">Upcoming Events</h2>
          {events.length === 0 ? <p>No upcoming events</p> : null}
          <div>
            {events.map((event, index) => (
              <div key={index} className="event-card" onClick={() => {
                handleEventClick(event,event);
               
              }}
              >
                <img src={event.image} alt={event.name} />
                <h3>{event.name}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p>{event.description}</p>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
    </div>
    
  );
  
}

export default App;
