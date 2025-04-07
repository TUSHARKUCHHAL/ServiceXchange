// EventsCalendar.js
import React, { useState, useEffect } from 'react';
import './EventsCalendar.css';

const EventsCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: 'Team Meeting', date: new Date(2025, 3, 8), time: '10:00 AM', location: 'Conference Room A' },
    { id: 2, title: 'Project Deadline', date: new Date(2025, 3, 15), time: '5:00 PM', location: 'Online' },
    { id: 3, title: 'Client Presentation', date: new Date(2025, 3, 10), time: '2:00 PM', location: 'Meeting Room B' },
    { id: 4, title: 'Workshop', date: new Date(2025, 3, 20), time: '9:00 AM', location: 'Training Center' }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    time: '',
    location: ''
  });

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    const [year, month, day] = dateValue.split('-').map(Number);
    
    setNewEvent({
      ...newEvent,
      date: new Date(year, month - 1, day)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = events.length > 0 ? Math.max(...events.map(event => event.id)) + 1 : 1;
    
    setEvents([
      ...events,
      {
        ...newEvent,
        id: newId
      }
    ]);
    
    setNewEvent({
      title: '',
      date: new Date(),
      time: '',
      location: ''
    });
    
    setShowForm(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const isSelected = date.getDate() === selectedDate.getDate() && 
                         date.getMonth() === selectedDate.getMonth() && 
                         date.getFullYear() === selectedDate.getFullYear();
      
      const isToday = date.getDate() === new Date().getDate() && 
                     date.getMonth() === new Date().getMonth() && 
                     date.getFullYear() === new Date().getFullYear();
      
      const dayEvents = events.filter(event => 
        event.date.getDate() === day && 
        event.date.getMonth() === month && 
        event.date.getFullYear() === year
      );
      
      const hasEvents = dayEvents.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasEvents && <span className="event-dot"></span>}
        </div>
      );
    }
    
    return days;
  };

  const getMonthName = (month) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
  };

  const getDayEvents = () => {
    return events.filter(event => 
      event.date.getDate() === selectedDate.getDate() && 
      event.date.getMonth() === selectedDate.getMonth() && 
      event.date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="events-calendar">
      <div className="calendar-container">
        <div className="calendar-header">
          <button className="nav-btn" onClick={prevMonth}>&lt;</button>
          <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
          <button className="nav-btn" onClick={nextMonth}>&gt;</button>
        </div>
        
        <div className="weekdays">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="days">
          {renderCalendar()}
        </div>
      </div>
      
      <div className="events-list">
        <div className="events-header">
          <h3>Events for {selectedDate.toDateString()}</h3>
          <button className="add-event-btn" onClick={toggleForm}>+ New Event</button>
        </div>
        
        {showForm && (
          <div className="event-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={newEvent.title} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Date</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formatDate(newEvent.date)} 
                  onChange={handleDateChange} 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Time</label>
                <input 
                  type="text" 
                  name="time" 
                  value={newEvent.time} 
                  onChange={handleInputChange} 
                  placeholder="e.g. 3:00 PM"
                  required 
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  value={newEvent.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Add Event</button>
                <button type="button" className="cancel-btn" onClick={toggleForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        
        <div className="event-items">
          {getDayEvents().length > 0 ? (
            getDayEvents().map(event => (
              <div key={event.id} className="event-item">
                <div className="event-time">{event.time}</div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <p className="event-location">{event.location}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No events scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsCalendar;